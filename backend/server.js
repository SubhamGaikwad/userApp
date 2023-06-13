const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const Post = require("./models/Post");
const app = express();
const PORT = 8000;
require("dotenv").config();
app.use(express.json());
app.use(cors());
mongoose
  .connect("mongodb://localhost:27017/user_app", {
    useNewUrlParser: true,
    // useUnifiedTopology: true,
    // useFindAndModify: false,
  })
  .then(() => {
    console.log("Connected to mongoDB");
  })
  .catch((error) => {
    console.error("Mongo erro", error);
  });
app.get("/posts", async (req, res) => {
  try {
    const posts = await Post.find();
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "An error occured while fetching posts" });
  }
});
app.post("/posts/new", async (req, res) => {
  try {
    const { title, body, userId } = req.body;
    const newPost = await Post.create({ title, body, userId });
    res.json(newPost);
  } catch (error) {
    res.status(500).json({ error: "An error occured" });
  }
});

app.put("/posts/update/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, body, userId } = req.body;
    const updatedPost = await Post.findByIdAndUpdate(
      id,
      { title, body, userId },
      { new: true }
    );
    res.json(updatedPost);
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while updating the post" });
  }
});

// DELETE API request to remove a post
app.delete("/posts/delete/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Post.findByIdAndDelete(id);
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res
      .status(500)
      .json({ error: "An error occurred while deleting the post" });
  }
});
app.listen(PORT, () => {
  console.log(`server is running on port ${PORT}`);
});
