const User = require("../models/user");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");
const bcrypt = require("bcryptjs");

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
    .escape(),
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
      res.render("sign_up", { title: "Sign up", error: errors.array()[0] });
    } else {
      try {
        bcrypt.hash(req.body.password, 10, async (err, hashedpassword) => {
          if (err) {
            throw new Error("Something went wrong");
          }
          const user = new User({
            firstName: req.body.firstName,
            lastName: req.body.lastName,
            username: req.body.username,
            password: hashedpassword,
            membership: "member",
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
