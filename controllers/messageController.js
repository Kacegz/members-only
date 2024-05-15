const Message = require("../models/message");
const asyncHandler = require("express-async-handler");
const { body, validationResult } = require("express-validator");

exports.index = asyncHandler(async (req, res, next) => {
  const messages = await Message.find({})
    .sort({ timestamp: 1 })
    .populate("user")
    .exec();
  res.render("index", {
    messages: messages,
  });
});

exports.send_message = [
  body("title", "Title must not be empty").trim().isLength({ min: 1 }).escape(),
  body("message", "Message must not be empty")
    .trim()
    .isLength({ min: 1 })
    .escape(),

  asyncHandler(async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.redirect("/");
    } else {
      const message = new Message({
        title: req.body.title,
        text: req.body.message,
        timestamp: new Date(),
        user: req.user.id,
      });

      message.save();
      res.redirect("/");
    }
  }),
];
exports.delete_message = asyncHandler(async (req, res, next) => {
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
