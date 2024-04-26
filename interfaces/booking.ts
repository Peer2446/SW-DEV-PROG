import mongoose from "mongoose";
import { roomType } from "./hotel";

export interface BookingDocument extends mongoose.Document {
  user: typeof mongoose.Schema.ObjectId;
  hotel: typeof mongoose.Schema.ObjectId;
  roomType: roomType;
  checkIn: Date;
  checkOut: Date;
  createdAt: Date;
}
