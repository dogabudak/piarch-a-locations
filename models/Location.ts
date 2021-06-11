import {model, Schema} from "mongoose";
import {LocationDocument} from "../types/Location";
// TODO put this enum somewhere which makes more sense
enum availability {
    featured,
    available
}
const Locations = new Schema({
  country: { type: String },
  cities: { type: Array },
  availability: { type: availability },
  });

export const LocationModel = model<LocationDocument>("locations", Locations);
