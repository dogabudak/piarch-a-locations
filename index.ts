import * as express from 'express';
import { connect } from "./src/database";
import {Availability} from "piarch-a-interfaces";

import 'dotenv/config'
import {LocationModel} from "./models/Location";
import { CountryCityService } from "./src/countryCityService";

const app = express();
// TODO use verification plug-in for the token check as a middleware
// TODO we should merge countryList and featuredList endpoint

connect().then(()=>{
    const countryCityService = CountryCityService.getInstance();
    
    app.get('/countryList', async (req, res) => {
        try {
            const countries = countryCityService.getAllCountries();
            res.json({countries: countries.map(c => c.name)});
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
    app.get('/featuredList', async (req, res) => {
        try {
            const locations = await LocationModel.find({availability: Availability.featured})
            const countries = locations.map((eachLocation) => eachLocation.countryName)
            res.send({countries});
        } catch (err) {
            res.send(400)
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
    app.listen(process.env.PORT);

})
