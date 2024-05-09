require("dotenv").config();
const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");
const passport = require("passport");

exports.sign_up_get = asyncHandler(async (req, res, next) => {
  res.render("sign_up", {
    title: "Sign up",
  });
});
exports.sign_up_post = [
  body("firstName", "First name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("lastName", "Last name must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),
  body("username", "username must be longer than 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .custom(async (value) => {
      const used = await User.findOne({ username: value });
      if (used) {
        throw new Error("Username already in use");
      }
    }),
  body("password", "password must be longer than 3 characters")
    .trim()
    .isLength({ min: 3 })
    .escape(),
  body("confirmPassword", "Password does not match")
    .trim()
    .isLength({ min: 3 })
    .escape()
    .custom((value, { req }) => {
      return value === req.body.password;
    }),
  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.render("sign_up", { error: errors.array()[0] });
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedpassword) => {
          if (err) {
            next(err);
          }
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedpassword,
            membership: false,
          });
          await user.save();
          res.redirect("/");
        });
      } catch (err) {
        next(err);
      }
    }
  }),
];

exports.join_club_get = asyncHandler((req, res, next) => {
  res.render("join_club");
});
exports.join_club_post = [
  body("code", "Code is wrong").custom((value) => {
    return value === process.env.membercode;
  }),
  asyncHandler(async (req, res, next) => {
    const error = validationResult(req);
    if (!error.isEmpty) {
      res.render("join_club", {
        error: error,
      });
    }
    console.log(req.user);
    const user = new User({
      firstName: req.user.firstName,
      lastName: req.user.lastName,
      username: req.user.username,
      password: req.user.password,
      _id: req.user.id,
      membership: true,
    });
    await User.findOneAndUpdate({ _id: req.user.id }, user);
    res.redirect("/");
  }),
];

exports.log_in_get = asyncHandler((req, res, next) => {
  res.render("log_in");
});

exports.log_in_post = [
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/log_in",
    failureMessage: true,
  }),
];
exports.log_out = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
};
