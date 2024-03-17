import * as express from 'express';
import { connect } from "./src/database";
import {Availability} from "piarch-a-interfaces";

import 'dotenv/config'
import {LocationModel} from "./models/Location";

const app = express();
// TODO use verification plug-in for the token check as a middleware
// TODO we should merge countryList and featuredList endpoint

connect().then(()=>{
    app.get('/countryList', async (req, res) => {
        try {
            const locations = await LocationModel.find({availability: Availability.available})
            const countries = locations.map((eachLocation) => eachLocation.countryName)
            res.send({countries});
        } catch (err) {
            res.send(400)
        }
    });
    app.get('/cityList/:country', async (req, res) => {
        try {
            const requestedCountry = req.params.country
            const country = await LocationModel.findOne({availability: Availability.available, countryName: requestedCountry })
            const cityList = country.cities.map((eachCity)=> eachCity.name)
            res.send(cityList);
        } catch (err) {
            res.send(400)
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
