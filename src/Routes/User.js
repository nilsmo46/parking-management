const express = require("express");
const { register, login, logout, getMe } = require("../Controller/User");

const router = express.Router();

const { protect } = require("../Middleware/Auth");

router.post("/api/user/register", register);
router.post("/api/user/login", login);
router.get("/api/user/logout", protect, logout);
router.get("/api/user/me", protect, getMe);

module.exports = router;
