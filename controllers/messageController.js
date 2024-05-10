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
  body("message").trim().isLength({ min: 1 }).escape(),
  body("title").trim().isLength({ min: 1 }).escape(),
  asyncHandler(async (req, res, next) => {
    const err = validationResult(req);
    const message = new Message({
      title: req.body.title,
      text: req.body.message,
      timestamp: new Date(),
      user: req.user.id,
    });
    if (!err.isEmpty) {
      res.render("index", {
        errors: err.array(),
      });
    }
    message.save();
    res.redirect("/");
  }),
];
exports.delete_message = asyncHandler(async (req, res, next) => {
  const message = await Message.findById(req.params.id).exec();
  console.log(message);
  await Message.findByIdAndDelete(req.params.id);
  res.redirect("/");
});
