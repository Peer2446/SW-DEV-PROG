import mongoose from "mongoose";
import { BookingDocument } from "../interfaces/booking";

const BookingSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: "User",
    required: true,
  },

  hotel: {
    type: mongoose.Schema.ObjectId,
    ref: "Hotel",
    required: true,
  },

  createdAt: {
    type: Date,
    default: Date.now,
  },

  roomType: {
    type: String,
    required: true,
  },

  checkIn: {
    type: Date,
    required: true,
  },

  checkOut: {
    type: Date,
    required: true,
  },
});

export default mongoose.model<BookingDocument>("Booking", BookingSchema);
