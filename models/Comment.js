const mongoose = require("mongoose");

const CommentSchema = new mongoose.Schema({
  user: {
    type: String,
    required: true,
  },
  postId: {
    type: String,
    require: true,
  },
  comment: {
    type: String,
    require: true,
  }
});

module.exports = mongoose.model("Comment", CommentSchema);
