import * as Mongoose from 'mongoose';
import { LocationModel } from '../models/Location';
import { CoordinateModel } from '../models/Coordinates';
import * as config from '../resources/config.json';

let database: Mongoose.Connection;

export const connect = () => {
    const uri = config.mongo.url;

    if (database) {
        return;
    }

    Mongoose.connect(uri, {
        useNewUrlParser: true,
        useFindAndModify: true,
        useUnifiedTopology: true,
        useCreateIndex: true,
    });

    database = Mongoose.connection;

    database.once('open', async () => {
        console.log('Connected to database');
    });

    database.on('error', () => {
        console.log('Error connecting to database');
    });

    return {
        LocationModel,
        CoordinateModel,
    };
};

export const disconnect = () => {
    if (!database) {
        return;
    }

    Mongoose.disconnect();
};
