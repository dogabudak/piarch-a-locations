import {model, Schema} from "mongoose";
import {CoordinateDocument} from "../types/Coordinates";

const Coordinates = new Schema({
    city: {type: String},
    locations: {
        "name": {type: String},
        "x": {type: Number},
        "y": {type: Number},
        "type": {type: String}
    },
});

export const CoordinateModel = model<CoordinateDocument>("coordinates", Coordinates);
