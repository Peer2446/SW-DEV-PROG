import mongoose from "mongoose";

export enum amentitie {
  Pool = "Pool",
  Gym = "Gym",
  Wifi = "Wifi",
  RoomService = "Room Service",
  Breakfast = "Breakfast",
  MeetingRooms = "Meeting Rooms",
  AirConditioning = "Air Conditioning",
  Television = "Television",
  HairDryer = "Hair Dryer",
  Refrigerator = "Refrigerator",
  Microwave = "Microwave",
  Parking = "Parking",
  WaterHeater = "Water Heater",
}

export enum roomType {
  Single = "Single",
  Double = "Double",
  Suite = "Suite",
  Family = "Family",
}

export interface HotelDocument extends mongoose.Document {
  name: string;
  address: string;
  district: string;
  province: string;
  postalcode: string;
  tel?: string;
  region: string;
  amenities: amentitie[];
  roomType: { type: roomType; price: number }[];
}

//gen mock hotel data amentities as string[] and roomType as {type: string, price: number}[] amentites = ["WIFI", "Pool", "Gym", "Breakfast", "Room Service", "Meeting Rooms", "Air Conditioning", "Television", "Hair Dryer", "Refrigerator", "Microwave", "Parking", "Water Heater"] roomType = ["Single", "Double", "Suite", "Family
