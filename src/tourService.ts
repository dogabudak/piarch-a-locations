import OpenAI from "openai";
import { TourType } from "piarch-a-interfaces";
import { GeneratedTourModel, GeneratedTourDocument } from "../models/GeneratedTour";
import { LocationModel } from "../models/Location";

interface TourRequest {
  city: string;
  tourType: TourType;
  duration: number;
}

interface Attraction {
  name: string;
  x: number;
  y: number;
  description?: { en?: string; tr?: string };
}

interface AiStop {
  attractionName: string;
  order: number;
  description: string;
  estimatedMinutes: number;
}

interface AiTour {
  tourName: string;
  shortDescription: string;
  distanceKm: number;
  stops: AiStop[];
}

const TOUR_TYPE_LABELS: Record<TourType, string> = {
  [TourType.Bike]: 'Biking',
  [TourType.Hike]: 'Walking',
  [TourType.Trekking]: 'Trekking',
};

// OpenRouter exposes an OpenAI-compatible API, so we drive it with the `openai`
// SDK and just point the base URL + model at OpenRouter. Swapping to another
// OpenAI-compatible provider (Groq, Ollama, etc.) is a pure env-var change.
const OPENROUTER_BASE_URL = process.env.OPENROUTER_BASE_URL || 'https://openrouter.ai/api/v1';
const OPENROUTER_MODEL = process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct:free';

export class TourService {
  private client: OpenAI | null;

  constructor() {
    const apiKey = process.env.OPENROUTER_API_KEY;
    this.client = apiKey
      ? new OpenAI({
          apiKey,
          baseURL: OPENROUTER_BASE_URL,
          // Optional attribution headers OpenRouter uses for ranking/analytics.
          defaultHeaders: {
            'HTTP-Referer': 'https://piarcha.app',
            'X-Title': 'Piarcha',
          },
        })
      : null;
  }

  async getOrGenerateTour(request: TourRequest): Promise<GeneratedTourDocument> {
    const { city, tourType, duration } = request;

    // 1. Check DB first — cache generated tours in the generated_tours collection.
    const existing = await GeneratedTourModel.findOne({
      cityName: city,
      tourType,
      duration,
    });

    if (existing) {
      return existing;
    }

    // 2. Fetch the city's attractions for AI context.
    const locationData = await LocationModel.aggregate([
      { $unwind: "$cities" },
      { $match: { "cities.name": city } },
      {
        $project: {
          _id: 0,
          countryName: 1,
          coordinates: "$cities.coordinates",
        },
      },
    ]).exec();

    const countryName = locationData[0]?.countryName;
    const attractions: Attraction[] = locationData[0]?.coordinates || [];

    // 3. Generate the tour with the LLM, falling back to a deterministic tour.
    const tourData = await this.generateTour(city, countryName, tourType, duration, attractions);

    // 4. Store — handle race condition via duplicate key error.
    try {
      const saved = await GeneratedTourModel.create(tourData);
      return saved;
    } catch (err: any) {
      if (err.code === 11000) {
        // Another request already stored this tour — return it.
        const raceWinner = await GeneratedTourModel.findOne({
          cityName: city,
          tourType,
          duration,
        });
        return raceWinner!;
      }
      throw err;
    }
  }

  async getToursByCity(city: string): Promise<GeneratedTourDocument[]> {
    return GeneratedTourModel.find({ cityName: city })
      .select('-stops')
      .sort({ tourType: 1, duration: 1 })
      .exec();
  }

  private async generateTour(
    city: string,
    countryName: string | undefined,
    tourType: TourType,
    duration: number,
    attractions: Attraction[],
  ) {
    // No API key or no attractions to reason about → deterministic fallback.
    if (!this.client || attractions.length === 0) {
      return this.buildFallbackTour(city, countryName, tourType, duration, attractions);
    }

    try {
      const aiTour = await this.callLlm(city, countryName, tourType, duration, attractions);
      const stops = this.mapStopsToCoordinates(aiTour.stops, attractions);

      // If the model didn't return usable, matchable stops, fall back.
      if (stops.length < 2) {
        return this.buildFallbackTour(city, countryName, tourType, duration, attractions);
      }

      const typeLabel = TOUR_TYPE_LABELS[tourType] || 'Walking';
      return {
        cityName: city,
        countryName,
        tourType,
        duration,
        tourName: aiTour.tourName || `${typeLabel} Tour of ${city}`,
        shortDescription:
          aiTour.shortDescription || `A curated ${typeLabel.toLowerCase()} tour through ${city}`,
        estimatedDuration: `${duration} hours`,
        distanceKm:
          typeof aiTour.distanceKm === 'number'
            ? aiTour.distanceKm
            : tourType === TourType.Bike ? 12.5 : 4.2,
        generatedBy: 'ai',
        stops,
      };
    } catch (err) {
      console.error('LLM tour generation failed, using fallback:', err);
      return this.buildFallbackTour(city, countryName, tourType, duration, attractions);
    }
  }

  private async callLlm(
    city: string,
    countryName: string | undefined,
    tourType: TourType,
    duration: number,
    attractions: Attraction[],
  ): Promise<AiTour> {
    const typeLabel = TOUR_TYPE_LABELS[tourType] || 'Walking';

    // Give the model the real attractions (with coordinates) as context. We ask
    // it to order and describe them; coordinates are re-attached from the DB
    // afterwards so the model can never invent map positions.
    const attractionContext = attractions
      .map((a, i) => {
        const desc = a.description?.en ? ` — ${a.description.en}` : '';
        return `${i + 1}. ${a.name} (lat ${a.x}, lng ${a.y})${desc}`;
      })
      .join('\n');

    const systemPrompt =
      'You are a local tour guide. You design walking, biking, and trekking tours ' +
      'through a city using ONLY the attractions provided. You respond with a single ' +
      'JSON object and nothing else.';

    const userPrompt = `Design a ${typeLabel.toLowerCase()} tour of ${city}${
      countryName ? `, ${countryName}` : ''
    } that takes roughly ${duration} hour(s).

Available attractions (use only these; refer to each by its exact name):
${attractionContext}

Requirements:
- Order the stops into a sensible route for a ${typeLabel.toLowerCase()} tour.
- Include between 2 and ${Math.min(attractions.length, 6)} stops.
- Write a short, engaging description (1-2 sentences) for each stop.
- Estimate minutes to spend at each stop so the total is close to ${duration * 60} minutes.
- Estimate the total route distance in kilometers.

Respond with ONLY this JSON shape:
{
  "tourName": string,
  "shortDescription": string,
  "distanceKm": number,
  "stops": [
    { "attractionName": string, "order": number, "description": string, "estimatedMinutes": number }
  ]
}`;

    const completion = await this.client!.chat.completions.create({
      model: OPENROUTER_MODEL,
      response_format: { type: 'json_object' },
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: userPrompt },
      ],
    });

    const content = completion.choices[0]?.message?.content;
    if (!content) {
      throw new Error('Empty response from LLM');
    }

    return JSON.parse(content) as AiTour;
  }

  // Re-attach real coordinates from the DB by matching the model's stop names to
  // known attractions. Drops any stop the model invented or misnamed.
  private mapStopsToCoordinates(aiStops: AiStop[], attractions: Attraction[]) {
    if (!Array.isArray(aiStops)) {
      return [];
    }

    const byName = new Map<string, Attraction>();
    for (const attr of attractions) {
      byName.set(attr.name.trim().toLowerCase(), attr);
    }

    return aiStops
      .sort((a, b) => (a.order ?? 0) - (b.order ?? 0))
      .map((stop) => {
        const attr = byName.get((stop.attractionName || '').trim().toLowerCase());
        if (!attr) {
          return null;
        }
        return {
          name: attr.name,
          description: stop.description || attr.description?.en || `A notable attraction in the area.`,
          x: attr.x,
          y: attr.y,
          estimatedMinutes:
            typeof stop.estimatedMinutes === 'number' ? stop.estimatedMinutes : 30,
        };
      })
      .filter((s): s is NonNullable<typeof s> => s !== null)
      .map((stop, i) => ({ ...stop, order: i + 1 }));
  }

  // Deterministic tour used when no LLM key is configured or generation fails.
  private buildFallbackTour(
    city: string,
    countryName: string | undefined,
    tourType: TourType,
    duration: number,
    attractions: Attraction[],
  ) {
    const typeLabel = TOUR_TYPE_LABELS[tourType] || 'Walking';

    const stops = attractions.length > 0
      ? attractions.slice(0, Math.min(attractions.length, 5)).map((attr, i) => ({
          order: i + 1,
          name: attr.name,
          description: attr.description?.en || `A notable attraction in ${city}.`,
          x: attr.x,
          y: attr.y,
          estimatedMinutes: Math.round((duration * 60) / Math.min(attractions.length, 5)),
        }))
      : [
          { order: 1, name: 'Hagia Sophia', description: 'A masterpiece of Byzantine architecture, originally built as a cathedral in 537 AD.', x: 41.008545, y: 28.9770532, estimatedMinutes: 30 },
          { order: 2, name: 'Blue Mosque', description: 'The Sultan Ahmed Mosque, known for its stunning blue Iznik tiles and six minarets.', x: 41.0054, y: 28.9768, estimatedMinutes: 25 },
          { order: 3, name: 'Basilica Cistern', description: 'An ancient underground water reservoir built in the 6th century.', x: 41.0084, y: 28.9779, estimatedMinutes: 20 },
          { order: 4, name: 'Topkapi Palace', description: 'The opulent main residence of the Ottoman sultans for nearly 400 years.', x: 41.0115, y: 28.9834, estimatedMinutes: 45 },
          { order: 5, name: 'Grand Bazaar', description: 'One of the oldest and largest covered markets in the world.', x: 41.0107, y: 28.968, estimatedMinutes: 30 },
        ];

    return {
      cityName: city,
      countryName,
      tourType,
      duration,
      tourName: `Historical ${typeLabel} Tour of ${city}`,
      shortDescription: `A curated ${typeLabel.toLowerCase()} tour through ${city}'s most iconic historical sites`,
      estimatedDuration: `${duration} hours`,
      distanceKm: tourType === TourType.Bike ? 12.5 : 4.2,
      generatedBy: 'fallback',
      stops,
    };
  }
}
