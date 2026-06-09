import { model, Schema, Document } from "mongoose";
import { GeneratedTour } from "piarch-a-interfaces";

export interface GeneratedTourDocument extends GeneratedTour, Document {}

const StopSchema = new Schema({
  order: { type: Number, required: true },
  name: { type: String, required: true },
  description: { type: String, required: true },
  x: { type: Number, required: true },
  y: { type: Number, required: true },
  estimatedMinutes: { type: Number, required: true },
}, { _id: false });

const GeneratedTourSchema = new Schema({
  cityName: { type: String, required: true, index: true },
  countryName: { type: String },
  tourType: { type: Number, required: true },
  duration: { type: Number, required: true },

  tourName: { type: String, required: true },
  shortDescription: { type: String, required: true },
  estimatedDuration: { type: String },
  distanceKm: { type: Number },
  generatedBy: { type: String, default: 'ai' },

  stops: [StopSchema],
}, { timestamps: true });

GeneratedTourSchema.index({ cityName: 1, tourType: 1, duration: 1 }, { unique: true });

export const GeneratedTourModel = model<GeneratedTourDocument>("generated_tours", GeneratedTourSchema);
