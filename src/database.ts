import * as Mongoose from 'mongoose';
import { LocationModel } from '../models/Location';

let database: Mongoose.Connection;

export const connect = async () => {
    const uri = process.env.MONGODB;

    if (database) {
        return;
    }

    await Mongoose.connect(uri, {
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
    };
};

export const disconnect = () => {
    if (!database) {
        return;
    }

    Mongoose.disconnect();
};
