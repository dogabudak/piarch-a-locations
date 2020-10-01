const express = require('express'),
    app = express(),
    config = require('./resources/config'),
    mongojs = require('mongojs'),
    db = mongojs(config.mongo.url, ['users']),
    nano = require('nanomsg'),
    nanoReq = nano.socket('req');

app.get('/cityList/:country', async (req, res) => {
    try {
      const list =  { cities: config.availableCities }
      //TODO get it from DB
      res.send(list);
    } catch (err) {
        res.send(400)
    }
});
app.get('/coordinates/:city', async (req, res) => {
    try {
      const list =  { cities: config.availableCities }
      //TODO get it from DB
      res.send(list);
    } catch (err) {
        res.send(400)
    }
});

app.get('/countryList', async (req, res) => {
    try {
      //TODO get it from DB
      res.send({ cities: config.featuredCities });
    } catch (err) {
        res.send(400)
    }
});
app.get('/featuredList', async (req, res) => {
    try {
        //TODO get it from DB
        res.send({ cities: config.featuredCities });
    } catch (err) {
        res.send(400)
    }
});

//TODO get it from config
app.listen(3019);

//TODO use this token checks
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
