const User = require("../models/User");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const createError = require("http-errors");

exports.register = async (req, res, next) => {
  try {
    const { username, phone, email, password, ...other } = req.body;
    const isUsername = await User.findOne({ username: username });
    if (isUsername) return next(createError(422, "Username already exists"));

    const isPhone = await User.findOne({ phone: phone });
    if (isPhone) return next(createError(422, "Phone already exists"));

    const isEmail = await User.findOne({ email: email });
    if (isEmail) return next(createError(422, "Email already exists"));

    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const newUser = new User({
      username,
      phone,
      email,
      ...other,
      password: hash,
    });

    await newUser.save();

    return res.status(200).send("Registration successful");
  } catch (error) {
    next(error);
  }
};

exports.postLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(400, "Wrong password or username!"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );

    const { password, isAdmin, ...otherDetails } = user._doc;
    console.log("Login user success >>", otherDetails._id);
    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, token });
  } catch (err) {
    next(err);
  }
};
exports.adminLogin = async (req, res, next) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) return next(createError(404, "User not found"));

    const isPasswordCorrect = await bcrypt.compare(
      req.body.password,
      user.password
    );
    if (!isPasswordCorrect)
      return next(createError(401, "Wrong password or username!"));

    if (!user.isAdmin)
      return next(createError(403, "This account is not an admin"));

    const token = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT
    );
    const { password, isAdmin, ...otherDetails } = user._doc;

    console.log("Login Admin success >>", otherDetails._id);

    res
      .cookie("token", token, {
        httpOnly: true,
      })
      .status(200)
      .json({ details: { ...otherDetails }, isAdmin, token });
  } catch (err) {
    next(err);
  }
};
exports.logout = (req, res, next) => {
  req.session.destroy(() => {
    res.clearCookie("token");
    return res.status(200).json("Logout success");
  });
};
