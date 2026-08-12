import {model, Schema} from "mongoose";
import {Availability, AttractionType, TourType} from "piarch-a-interfaces";

import {LocationDocument} from "../types/Location";

// These are numeric TS enums, so Object.values() yields both the names and the
// numbers (reverse mapping). Mongoose needs just the numbers.
const numericValues = (e: object): number[] =>
  Object.values(e).filter((v): v is number => typeof v === "number");

const Locations = new Schema({
  countryName: { type: String },
  availability: { type: Number, enum: numericValues(Availability) },
  cities: [{
    name: { type: String },
    availability: { type: Number, enum: numericValues(Availability) },
    coordinates:[{
      name : { type: String }, //example: "Ayasofya"
      x : { type: Number },
      y : { type: Number },
      description : {
        en : { type: String },
        tr : { type: String },
      },
      advertisement : { default: false, type: Boolean },
      type : { type: Number, enum: numericValues(AttractionType) },
    }],
    tours:[{
      tourName:{ type: String },
      shortDescription:{ type: String },
      tourType: { type: Number, enum: numericValues(TourType) }
    }]
  }],
  });

export const LocationModel = model<LocationDocument>("locations", Locations);
