import {model, Schema} from "mongoose";
import {Availability, AttractionType, TourType} from "piarch-a-interfaces";

import {LocationDocument} from "../types/Location";

const Locations = new Schema({
  countryName: { type: String },
  availability: { type: Availability },
  cities: [{
    name: { type: String },
    availability: { type: Availability },
    coordinates:[{
      name : { type: String }, //example: "Ayasofya"
      x : { type: Number },
      y : { type: Number },
      type : { type: AttractionType },
    }],
    tours:[{
      tourName:{ type: String },
      shortDescription:{ type: String },
      tourType: { type: TourType }
    }]
  }],
  });

export const LocationModel = model<LocationDocument>("locations", Locations);