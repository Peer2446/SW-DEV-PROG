import mongoose from "mongoose";

export interface UserDocument extends Document {
  name: string;
  tel?: string;
  email: string;
  role: "user" | "admin";
  password: string;
  resetPasswordToken?: string;
  resetPasswordExpire?: Date;
  createdAt: Date;

  // Define custom methods
  matchPassword(enteredPassword: string): Promise<boolean>;
  getSignedJwtToken(): string;
}
