const express = require("express");
const User = require("../models/User");
const Post = require("../models/Post");
const { protect } = require("../middleware/authMiddleware");
const { admin } = require("../middleware/adminAuthMiddleware");

const router = express.Router();

router.get("/users", protect, admin, async (req, res) => {
  try {
    const users = await User.find().select("-password");
    res.json(users);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

router.get("/posts", protect, admin, async (req, res) => {
  try {
    const posts = await Post.find().sort({ date: -1 });
    res.json(posts);
  } catch (error) {
    console.error(error.message);
    res.status(500).send("Server error");
  }
});

module.exports = router;
