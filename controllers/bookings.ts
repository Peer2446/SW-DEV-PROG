import Booking from "../models/booking";
import Hotel from "../models/Hotel";

// @desc    Get all bookings
// @route   GET /api/bookings
// @access  Public

export const getBookings = async (req, res, next) => {
  let query;

  if (req.user.role !== "admin") {
    query = Booking.find({ user: req.user.id }).populate({
      path: "hotel",
      select: "name province tel",
    });
  } else {
    if (req.params.hotelId) {
      console.log(req.params.hotelId);
      query = Booking.find({ hotel: req.params.hotelId }).populate({
        path: "hotel",
        select: "name province tel",
      });
    } else {
      query = Booking.find().populate({
        path: "hotel",
        select: "name province tel",
      });
    }
  }
  try {
    const bookings = await query;
    res
      .status(200)
      .json({ success: true, count: bookings.length, data: bookings });
  } catch (err) {
    res.status(400).json({ success: false, message: "Cannot find Booking" });
  }
};

// @desc    Get single booking
// @route   GET /api/bookings/:id
// @access  Public
export const getBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id).populate({
      path: "hotel",
      select: "name province tel",
    });
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with the id of ${req.params.id}`,
      });
    }
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    res.status(500).json({ success: false, message: "Cannot find Booking" });
  }
};

// @desc    Add booking
// @route   POST /api/hotels/:hotelId/booking
// @access  Private
export const addBooking = async (req, res, next) => {
  try {
    req.body.user = req.user.id;
    console.log(req.user.id);

    const existBookings = await Booking.find({ user: req.user.id });
    if (existBookings.length >= 3 && req.user.role !== "admin") {
      return res.status(400).json({
        success: false,
        message: `The user with ID ${req.user.id} has already made 3 bookings`,
      });
    }
    req.body.hotel = req.params.hotelId;

    const hotel = await Hotel.findById(req.body.hotel);

    if (!hotel) {
      return res.status(404).json({
        success: false,
        message: `No hotel found with the id of ${req.params.hotelId}`,
      });
    }

    if (req.body.roomType && !hotel.roomType.includes(req.body.roomType)) {
      return res.status(404).json({
        success: false,
        message: `No room type found with the type of ${req.params.roomType}`,
      });
    }

    const booking = await Booking.create(req.body);
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false, message: "Cannot create Booking" });
  }
};

// @desc    Update booking
// @route   PUT /api/bookings/:id
// @access  Private
export const updateBooking = async (req, res, next) => {
  try {
    let booking = await Booking.findById(req.params.id);

    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to update booking`,
      });
    }

    booking = await Booking.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    res.status(200).json({ success: true, data: booking });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Cannot update Booking" });
  }
};

// @desc    Delete booking
// @route   DELETE /api/bookings/:id
// @access  Private

export const deleteBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({
        success: false,
        message: `No booking found with the id of ${req.params.id}`,
      });
    }

    if (booking.user.toString() !== req.user.id && req.user.role !== "admin") {
      return res.status(401).json({
        success: false,
        message: `User ${req.user.id} is not authorized to delete this bootcamp`,
      });
    }

    await booking.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Cannot delete Booking" });
  }
};
