import * as express from 'express';
import * as mongojs from 'mongojs';
import * as nano from 'nanomsg';
import * as config from './resources/config.json';

const nanoReq = nano.socket('req');
const app = express();
//TODO this is wrong db
const db = mongojs(config.mongo.url, ['users']);
app.get('/cityList/:country', (req, res) => {
    try {
        const country = req.params.country
        const list = {cities: config.availableCities[country]}
        //TODO get it from DB
        res.send(list);
    } catch (err) {
        res.send(400)
    }
});
app.get('/coordinates/:city', (req, res) => {
    try {
        //TODO get it from DB
        const list = {coordinates: config.coordinates[req.params.city]}
        res.send(list);
    } catch (err) {
        res.send(400)
    }
});

app.get('/countryList', (req, res) => {
    try {
        //TODO get it from DB
        res.send({countries: Object.keys(config.availableCities)});
    } catch (err) {
        res.send(400)
    }
});
app.get('/featuredList', (req, res) => {
    try {
        //TODO get it from DB
        res.send({cities: config.featuredCities});
    } catch (err) {
        res.send(400)
    }
});

//TODO get it from config
app.listen(3019);

//TODO use this token checks
/*
function tokenCheck(request) {
    return new Promise((resolve, reject) => {
        let body = request.body;
        let token = body.token;
        nanoReq.send('jwt ' + token);
        nanoReq.on('data', function (buf) {
            if (buf.toString() === 'true') {
                resolve()
            } else {
                reject()
            }
        });
    })
}
 */
