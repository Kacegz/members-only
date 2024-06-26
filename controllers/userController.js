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
            admin: false,
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

exports.join_club_get = asyncHandler(async (req, res, next) => {
  res.render("join_club");
});
exports.join_club_post = asyncHandler(async (req, res, next) => {
  if (req.body.code === process.env.membercode) {
    const user = new User({
      _id: req.user.id,
      membership: true,
    });
    await User.findOneAndUpdate({ _id: req.user.id }, user);
    res.redirect("/");
  } else {
    res.render("join_club", {
      error: "Code is wrong",
    });
  }
});

exports.log_in_get = asyncHandler(async (req, res, next) => {
  res.render("log_in");
});

exports.log_in_post = passport.authenticate("local", {
  successRedirect: "/",
  failureRedirect: "/log_in",
  failureMessage: true,
});
exports.log_out = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
  });
  res.redirect("/");
};

exports.set_admin_get = asyncHandler(async (req, res) => {
  res.render("admin");
});

exports.set_admin_post = asyncHandler(async (req, res, next) => {
  if (req.body.code === process.env.admin) {
    const user = new User({
      ...req.user,
      _id: req.user.id,
      admin: true,
    });
    await User.findOneAndUpdate({ _id: req.user.id }, user);
    res.redirect("/");
  } else {
    res.render("admin", {
      error: "wrong code",
    });
  }
});
