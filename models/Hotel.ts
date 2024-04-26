import mongoose from "mongoose";
import { HotelDocument } from "../interfaces/hotel";

const HotelSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Please add a name"],
      unique: true,
      trim: true,
      maxlength: [50, "Name can not be more than 50 characters"],
    },
    address: {
      type: String,
      required: [true, "Please add an address"],
    },
    district: {
      type: String,
      required: [true, "Please add a district"],
    },
    province: {
      type: String,
      required: [true, "Please add a province"],
    },
    postalcode: {
      type: String,
      required: [true, "Please add a postalcode"],
      maxlength: [5, "Postal Code can not be more than 5 digits"],
    },
    tel: {
      type: String,
    },
    region: {
      type: String,
      required: [true, "Please add a region"],
    },
    amenities: {
      type: [String],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Amenities must have at least one item",
      },
    },
    starterPrice: {
      type: Number,
      required: [true, "Please add a starting price"],
      validate: {
        validator: function (value) {
          return value > 0;
        },
        message: "Price must be greater than 0",
      },
    },
    roomType: {
      type: [
        {
          type: {
            type: String,
            required: [true, "Please add a room type"],
          },
          price: {
            type: Number,
            required: [true, "Please add a price"],
            validate: {
              validator: function (value) {
                return value > 0;
              },
              message: "Price must be greater than 0",
            },
          },
        },
      ],
      validate: {
        validator: function (arr) {
          return arr.length > 0;
        },
        message: "Room Type must have at least one item",
      },
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

HotelSchema.virtual("bookings", {
  ref: "Booking",
  localField: "_id",
  foreignField: "hotel",
  justOne: false,
});

HotelSchema.pre(
  "deleteOne",
  { document: true, query: false },
  async function (next) {
    console.log(`Bookings are being removed from the hotel ${this._id}`);
    await this.model("Booking").deleteMany({ hotel: this._id });
    next();
  }
);

export default mongoose.model<HotelDocument>("Hotel", HotelSchema);
