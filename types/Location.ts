import { Document, Model } from "mongoose";
enum availability {
    featured,
    available
}
export interface Location {
    country: string;
    cities: string[];
    availability: availability;
}
export interface LocationDocument extends Location, Document {}
export interface LocationModel extends Model<LocationDocument> {}
