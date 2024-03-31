import express from "express";
import {
  getHotels,
  getHotel,
  createHotel,
  updateHotel,
  deleteHotel,
} from "../controllers/hotels";
import { protect, authorize } from "../middleware/auth";

const bookingRouter = require("./bookings");

const router = express.Router();

// Re-route into other resource routers
router.use("/:hotelId/bookings", bookingRouter);

router.route("/").get(getHotels).post(protect, authorize("admin"), createHotel);
router
  .route("/:id")
  .get(getHotel)
  .put(protect, authorize("admin"), updateHotel)
  .delete(protect, authorize("admin"), deleteHotel);

export default router;
