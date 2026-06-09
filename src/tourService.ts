import { TourType } from "piarch-a-interfaces";
import { GeneratedTourModel, GeneratedTourDocument } from "../models/GeneratedTour";
import { LocationModel } from "../models/Location";

interface TourRequest {
  city: string;
  tourType: TourType;
  duration: number;
}

const TOUR_TYPE_LABELS: Record<TourType, string> = {
  [TourType.Bike]: 'Biking',
  [TourType.Hike]: 'Walking',
  [TourType.Trekking]: 'Trekking',
};

export class TourService {
  async getOrGenerateTour(request: TourRequest): Promise<GeneratedTourDocument> {
    const { city, tourType, duration } = request;

    // 1. Check DB first
    const existing = await GeneratedTourModel.findOne({
      cityName: city,
      tourType,
      duration,
    });

    if (existing) {
      return existing;
    }

    // 2. Fetch the city's attractions for AI context
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
    const attractions = locationData[0]?.coordinates || [];

    // 3. Generate tour (stub — returns mock data, to be replaced with Claude API)
    const tourData = this.generateMockTour(city, countryName, tourType, duration, attractions);

    // 4. Store — handle race condition via duplicate key error
    try {
      const saved = await GeneratedTourModel.create(tourData);
      return saved;
    } catch (err: any) {
      if (err.code === 11000) {
        // Another request already stored this tour — return it
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

  private generateMockTour(
    city: string,
    countryName: string | undefined,
    tourType: TourType,
    duration: number,
    attractions: any[],
  ) {
    const typeLabel = TOUR_TYPE_LABELS[tourType] || 'Walking';

    // Use real attractions if available, otherwise fall back to hardcoded Istanbul data
    const stops = attractions.length > 0
      ? attractions.slice(0, Math.min(attractions.length, 5)).map((attr: any, i: number) => ({
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
      generatedBy: 'ai',
      stops,
    };
  }
}
