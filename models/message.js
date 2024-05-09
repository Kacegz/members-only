const mongoose = require("mongoose");
const dayjs = require("dayjs");
const Schema = mongoose.Schema;

const MessageSchema = new Schema({
  title: { type: String, required: true },
  text: { type: String, required: true },
  timestamp: { type: Date, required: true },
  user: { type: Schema.Types.ObjectId, ref: "User", required: true },
});
MessageSchema.virtual("formattedDate").get(() => {
  return dayjs(this.timestamp).format("DD MMM");
});
module.exports = mongoose.model("Message", MessageSchema);
