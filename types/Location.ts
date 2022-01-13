import { Document, Model } from "mongoose";
import {Locations} from "piarch-a-interfaces";
export interface LocationDocument extends Locations, Document {}
export interface LocationModel extends Model<LocationDocument> {}
