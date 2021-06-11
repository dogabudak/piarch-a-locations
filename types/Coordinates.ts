import { Document, Model } from "mongoose";

export interface Coordinates {
    coordinates: string[];
    city: string;
}
export interface CoordinateDocument extends Coordinates, Document {}
export interface CoordinateModel extends Model<CoordinateDocument> {}
