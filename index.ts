import * as express from 'express';
import { connect } from "./src/database";
import * as config from './resources/config.json';

const app = express();
const db = connect();

app.get('/countryList', async (req, res) => {
    try {
        //TODO why do you need to ignore this ?
        // @ts-ignore
        const cityList = await db.LocationModel.find({availability:'available'})
        const countries = cityList.map((eachLocation) => eachLocation.country)
        res.send({countries});
    } catch (err) {
        res.send(400)
    }
});
app.get('/cityList/:country', async (req, res) => {
    try {
        const country = req.params.country
        // TODO why do you need to ignore this ?
        // @ts-ignore
        const cityList = await db.LocationModel.findOne({availability:'available', country })
        res.send(cityList);
    } catch (err) {
        res.send(400)
    }
});
app.get('/featuredList', async (req, res) => {
    try {
        //TODO why do you need to ignore this ?
        // @ts-ignore
        const cityList = await db.LocationModel.find({"availability" : "featured"})
        const countries = cityList.map((eachLocation) => eachLocation.country)
        res.send({countries});
    } catch (err) {
        res.send(400)
    }
});
app.get('/coordinates/:city', async (req, res) => {
    try {
        const city = req.params.city
        const stream = await db.CoordinateModel.findOne({ city }).cursor()
        res.setHeader('Content-Type', 'application/json');
        stream.on('data', (doc) =>{
            res.write(JSON.stringify(doc));
        });
        stream.on('end', ()=> {
            res.end();
        });
    } catch (err) {
        res.send(400)
    }
});


app.listen(config.port);

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
