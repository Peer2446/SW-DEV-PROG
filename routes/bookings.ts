import express from "express";
import {
  getBookings,
  getBooking,
  addBooking,
  updateBooking,
  deleteBooking,
} from "../controllers/bookings";
import { protect, authorize } from "../middleware/auth";

const router = express.Router({ mergeParams: true });

router
  .route("/")
  .get(protect, authorize("admin"), getBookings)
  .post(protect, authorize("admin", "user"), addBooking);
router
  .route("/:id")
  .get(protect, authorize("admin", "user"), getBooking)
  .put(protect, authorize("admin", "user"), updateBooking)
  .delete(protect, authorize("admin", "user"), deleteBooking);

export default router;
