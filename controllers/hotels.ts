import Hotel from "../models/Hotel";

// @desc    Get all hotels
// @route   GET /api/hotels
// @access  Public
export const getHotels = async (req, res, next) => {
  try {
    let query;
    const reqQuery = { ...req.query };

    const removeFields = ["select", "sort", "page", "limit"];
    removeFields.forEach((param) => delete reqQuery[param]);
    console.log(reqQuery);

    let queryStr = JSON.stringify(reqQuery);

    queryStr = queryStr.replace(
      /\b(gt|gte|lt|lte|in)\b/g,
      (match) => `$${match}`
    );
    query = Hotel.find(JSON.parse(queryStr)).populate("appointments");

    if (req.query.select) {
      const fields = req.query.select.split(",").join(" ");
      query = query.select(fields);
    }

    if (req.query.sort) {
      const sortBy = req.query.sort.split(",").join(" ");
      query = query.sort(sortBy);
    } else {
      query = query.sort("-createdAt");
    }
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = page * limit;
    const total = await Hotel.countDocuments();
    query = query.skip(startIndex).limit(limit);

    const hotels = await query;

    const pagination: {
      next?: { page: number; limit: number };
      prev?: { page: number; limit: number };
    } = {};

    if (endIndex < total) {
      pagination.next = {
        page: page + 1,
        limit,
      };
    }
    if (startIndex > 0) {
      pagination.prev = {
        page: page - 1,
        limit,
      };
    }

    res.status(200).json({
      success: true,
      count: hotels.length,
      pagination,
      data: hotels,
    });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Get single hotel
// @route   GET /api/hotels/:id
// @access  Public
export const getHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Create new hotel
// @route   POST /api/hotels
// @access  Private
export const createHotel = async (req, res, next) => {
  const hotel = await Hotel.create(req.body);
  res.status(201).json({ success: true, data: hotel });
};

// @desc    Update hotel
// @route   PUT /api/hotels/:id
// @access  Private
export const updateHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });
    if (!hotel) {
      return res.status(400).json({ success: false });
    }
    res.status(200).json({ success: true, data: hotel });
  } catch (err) {
    res.status(400).json({ success: false });
  }
};

// @desc    Delete hotel
// @route   DELETE /api/hotels/:id
// @access  Private
export const deleteHotel = async (req, res, next) => {
  try {
    const hotel = await Hotel.findById(req.params.id);
    if (!hotel) {
      return res.status(404).json({ success: false });
    }
    await hotel.deleteOne();
    res.status(200).json({ success: true, data: {} });
  } catch (err) {
    console.log(err);
    res.status(400).json({ success: false });
  }
};