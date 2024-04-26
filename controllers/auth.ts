import User from "../models/User";
import { validateUser } from "../lib/validate/user";

// @desc    Register user
// @route   POST /api/auth/register
// @access  Public
export const register = async (req, res, next) => {
  try {
    const { name, email, tel, password, role } = req.body;

    if (!validateUser(name, email, tel, password, role)) {
      return res.status(400).json({ success: false, message: "Invalid input" });
    }
    // Create user
    const user = await User.create({
      name,
      email,
      password,
      role,
    });
    sendTokenResponse(user, 201, res);
  } catch (err) {
    res.status(400).json({ success: false });
    console.log(err);
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
export const login = async (req, res, next) => {
  const { email, password } = req.body;

  // Validate email & password
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Please provide an email and password" });
  }

  // Check for user
  const user = await User.findOne({ email }).select("password");

  if (!user) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });
  }

  // Check if password matches
  const isMatch = await user?.matchPassword(password);

  if (!isMatch) {
    return res
      .status(401)
      .json({ success: false, error: "Invalid credentials" });
  }

  sendTokenResponse(user, 200, res);
};

// Get token from model, create cookie and send response
const sendTokenResponse = (user, statusCode, res) => {
  // Create token
  const expiresIn = process.env.JWT_COOKIE_EXPIRE
    ? parseInt(process.env.JWT_COOKIE_EXPIRE)
    : 0;
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(Date.now() + expiresIn * 24 * 60 * 60 * 1000),
    httpOnly: true,
    secure: false,
  };

  if (process.env.NODE_ENV === "production") {
    options.secure = true;
  }

  res.status(statusCode).cookie("token", token, options).json({
    success: true,
    token,
  });
};

// @desc    Get current logged in user
// @route   POST /api/v1/auth/me
// @access  Private
export const getMe = async (req, res, next) => {
  const user = await User.findById(req.user.id);
  res.status(200).json({ success: true, data: user });
};

//@desc Log user out / clear cookie
//@route GET /api/v1/auth/logout
//@access Private
export const logout = async (req, res, next) => {
  res.cookie("token", "none", {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true,
  });

  res.status(200).json({
    success: true,
    data: {},
  });
};
