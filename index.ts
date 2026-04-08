import * as express from 'express';
import { connect } from "./src/database";
import {Availability} from "piarch-a-interfaces";

import 'dotenv/config'
import {LocationModel} from "./models/Location";
import { CountryCityService } from "./src/countryCityService";

const app = express();
app.use(express.json());
// TODO use verification plug-in for the token check as a middleware

connect().then(()=>{
    const countryCityService = CountryCityService.getInstance();
    
    app.get('/countryList', async (req, res) => {
        try {
            const countries = countryCityService.getAllCountries();
            const featuredLocations = await LocationModel.find({availability: Availability.featured});
            const featuredCountries = featuredLocations.map((eachLocation) => eachLocation.countryName);

            res.json({
                countries: countries.map(c => c.name),
                featured: featuredCountries
            });
        } catch (err) {
            res.status(400).json({error: 'Failed to fetch countries'});
        }
    });

    app.get('/cityList/:country', async (req, res) => {
        try {
            const requestedCountry = req.params.country;
            const cities = countryCityService.getCitiesByCountryName(requestedCountry);
            res.json(cities.map(c => c.name));
        } catch (err) {
            res.status(400).json({error: 'Failed to fetch cities'});
        }
    });

    // New standardized endpoints
    app.get('/countries', async (req, res) => {
        try {
            const countries = countryCityService.getAllCountries();
            res.json(countries);
        } catch (err) {
            res.status(400).json({error: 'Failed to fetch countries'});
        }
    });



    app.get('/cities/:countryCode', async (req, res) => {
        try {
            const countryCode = req.params.countryCode;
            const cities = countryCityService.getCitiesByCountry(countryCode);
            res.json(cities);
        } catch (err) {
            res.status(400).json({error: 'Failed to fetch cities'});
        }
    });

    app.get('/search/cities', async (req, res) => {
        try {
            const query = req.query.q as string;
            const limit = parseInt(req.query.limit as string) || 10;
            
            if (!query) {
                return res.status(400).json({error: 'Query parameter "q" is required'});
            }
            
            const cities = countryCityService.searchCities(query, limit);
            res.json(cities);
        } catch (err) {
            res.status(400).json({error: 'Failed to search cities'});
        }
    });

    app.get('/coordinates/:city', async (req, res) => {
        try {
            const { city, language = 'en'} = req.params
            // return coordinates and tours
            const result = await LocationModel.aggregate([
                {
                    $unwind: "$cities"
                },
                {
                    $match: {
                        "cities.name": city
                    }
                },
                {
                    $unwind: "$cities.coordinates"
                },
                {
                    $project: {
                        _id: 0,
                        "city": "$cities.name",
                        "name": "$cities.coordinates.name",
                        "description": `$cities.coordinates.description.${language}`,
                        "x": "$cities.coordinates.x",
                        "y": "$cities.coordinates.y",
                    }
                }
            ]).exec()
            res.send({coordinates: result});
        } catch (err) {
            res.send(400)
        }
    })
    app.get('/tours/:city', async (req, res) => {
        // TODO this should work with the language parameter
    })

    app.post('/generate-tour', async (req, res) => {
        try {
            const { city, preferences } = req.body;

            if (!city) {
                return res.status(400).json({ error: 'City is required' });
            }

            // TODO: Replace mock data with Claude API call
            const mockTour = {
                tourName: `Historical ${preferences?.tourType === 'biking' ? 'Biking' : 'Walking'} Tour of ${city}`,
                shortDescription: `A curated ${preferences?.tourType === 'biking' ? 'biking' : 'walking'} tour through ${city}'s most iconic historical sites`,
                tourType: preferences?.tourType === 'biking' ? 'Bike' : 'Hike',
                estimatedDuration: `${preferences?.duration || 3} hours`,
                distanceKm: preferences?.tourType === 'biking' ? 12.5 : 4.2,
                generatedBy: 'ai',
                stops: [
                    {
                        order: 1,
                        name: 'Hagia Sophia',
                        description: 'A masterpiece of Byzantine architecture, originally built as a cathedral in 537 AD before becoming a mosque and now a museum.',
                        x: 41.008545,
                        y: 28.9770532,
                        estimatedMinutes: 30,
                    },
                    {
                        order: 2,
                        name: 'Blue Mosque',
                        description: 'The Sultan Ahmed Mosque, known for its stunning blue Iznik tiles and six minarets, is one of Istanbul\'s most iconic landmarks.',
                        x: 41.0054,
                        y: 28.9768,
                        estimatedMinutes: 25,
                    },
                    {
                        order: 3,
                        name: 'Basilica Cistern',
                        description: 'An ancient underground water reservoir built in the 6th century, featuring 336 marble columns and the famous Medusa head bases.',
                        x: 41.0084,
                        y: 28.9779,
                        estimatedMinutes: 20,
                    },
                    {
                        order: 4,
                        name: 'Topkapi Palace',
                        description: 'The opulent main residence of the Ottoman sultans for nearly 400 years, now a museum housing imperial collections.',
                        x: 41.0115,
                        y: 28.9834,
                        estimatedMinutes: 45,
                    },
                    {
                        order: 5,
                        name: 'Grand Bazaar',
                        description: 'One of the oldest and largest covered markets in the world, with over 4,000 shops across 61 covered streets.',
                        x: 41.0107,
                        y: 28.9680,
                        estimatedMinutes: 30,
                    },
                ],
            };

            res.json(mockTour);
        } catch (err) {
            res.status(500).json({ error: 'Failed to generate tour' });
        }
    });

    app.listen(process.env.PORT);

})
