const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const messageController = require("../controllers/messageController");

/* GET home page. */
router.get("/", messageController.index);
router.get("/sign_up", userController.sign_up_get);
router.post("/sign_up", userController.sign_up_post);
router.get("/join_club", userController.join_club_get);
router.post("/join_club", userController.join_club_post);
router.get("/log_in", userController.log_in_get);
router.post("/log_in", userController.log_in_post);
router.get("/log_out", userController.log_out);
router.post("/send_message", messageController.send_message);

module.exports = router;
