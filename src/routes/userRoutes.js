const express = require("express");
const router = express.Router();
const userController = require("../controllers/userController");
const verifyToken = require("../middlewares/authMiddleware");
const newController = require('../controllers/newController')

router.post("/register", userController.register);
router.post("/login", userController.login);
router.get("/all-users",verifyToken,userController.allUsers);
router.post("/update-user",userController.updateUser);
router.post("/update-user-password",userController.updatePassword);
router.post("/delete-user",userController.deleteUser);
router.post("/send-otp",userController.sendEmailOTP);
router.post("/verify-otp",userController.verifyOTP);
router.get("/discourse/sso",newController.discourseSSO);

module.exports = router;