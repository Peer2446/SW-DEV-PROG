import express from "express";
import { config } from "dotenv";
import cookieParser from "cookie-parser";
import connectDB from "./config/db";

import mongoSanitize from "express-mongo-sanitize";
import helmet from "helmet";
import { xss } from "express-xss-sanitizer";
import rateLimit from "express-rate-limit";
import hpp from "hpp";
import cors from "cors";

// Load env vars
config({ path: "./config/config.env" });

//Connect to database
connectDB();

// Route files
import hotels from "./routes/hotels";
import auth from "./routes/auth";
import bookings from "./routes/bookings";

const app = express();

// Body parser
app.use(express.json());

// Cookie parser
app.use(cookieParser());

app.use("/api/hotels", hotels);
app.use("/api/auth", auth);
app.use("/api/bookings", bookings);

app.use(cors());

//Sanitize data
app.use(mongoSanitize());

//Set security headers
app.use(helmet());

//Prevent XSS attacks
app.use(xss());

//Rate Limiting
const limiter = rateLimit({
  windowMs: 10 * 60 * 1000, //10 mins
  max: 100,
});
app.use(limiter);

//Prevent http param pollutions
app.use(hpp());

app.get("/", (req, res) => {
  res.status(200).json({ success: true, data: { id: 1 } });
});

const PORT = process.env.PORT || 5000;
const server = app.listen(PORT, () =>
  console.log(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${(err as Error).message}`);
  // Close server & exit process
  server.close(() => process.exit(1));
});
