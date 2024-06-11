const mongoose = require("mongoose");

// •	Imports the Mongoose library, which is used to interact with MongoDB.
//The Mongoose library is a tool that helps you interact with a MongoDB database using JavaScript. It allows you to define the structure of your data (schemas) and provides methods to create, read, update, and delete records easily.

// Think of a schema as a template for creating objects.

// •	UserSchema: Defines that a user will have a name (string), an email (string), and an optional age (number).
// •	User: Creates a model named “User” based on the schema, allowing you to interact with user data in the database.




// This schema creates a model (Post) for your application. Each post will have a title, image, Cloudinary ID, caption, like count, user reference, and creation date. It ensures all posts have the same structure for consistent data management.
// ⬇️⬇️⬇️
const PostSchema = new mongoose.Schema({
  // •	Defines a new schema for posts using Mongoose.
  title: {
    type: String,
    required: true,
  },
  // •	Adds a title field that must be a string and is required.
  image: {
    type: String,
    require: true,
  },
  // •	Adds an image field that must be a string and is required.
  cloudinaryId: {
    type: String,
    require: true,
  },
  // •	Adds a cloudinaryId field that must be a string and is required.
  caption: {
    type: String,
    required: true,
  },
  // •	Adds a caption field that must be a string and is required.
  likes: {
    type: Number,
    required: true,
  },
  // •	Adds a likes field that must be a number and is required.
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  // •	Adds a user field that stores an ObjectId referencing the User model.
  createdAt: {
    type: Date,
    default: Date.now,
  },
  // •	Adds a createdAt field that stores the date and time when the post is created, defaulting to the current date and time.
});
//•	Closes the schema definition.


module.exports = mongoose.model("Post", PostSchema);
// •	Creates and exports a Mongoose model named “Post” based on the defined schema, allowing it to be used in other parts of the application.
