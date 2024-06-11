const cloudinary = require("../middleware/cloudinary"); 
// Imports the cloudinary middleware for handling image uploads

const Post = require("../models/Post"); 
// Imports the Post model for interacting with the posts collection in the database

module.exports = {
    // Exports an object containing various methods so they can be used in other parts of the application.
      getProfile: async (req, res) => {
    // Defines an asynchronous function named getProfile that takes request (req) and response (res) objects as arguments.
        try {
    // Starts a try block to handle any potential errors within the block.
          const posts = await Post.find({ user: req.user.id });
    // Uses the Post model to find all posts where the user field matches the logged-in user's ID, and waits for the result.
      // Fetches posts created by the logged-in user
      res.render("profile.ejs", { posts: posts, user: req.user }); 
      // Renders the profile.ejs view, passing the fetched posts and user info
    } catch (err) {
      console.log(err); 
      // Logs any errors that occur
    }
  },
  getFeed: async (req, res) => {
    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean(); 
      // Fetches all posts, sorted by creation date in descending order, and converts them to plain JavaScript objects
      res.render("feed.ejs", { posts: posts }); 
      // Renders the feed.ejs view, passing the fetched posts
    } catch (err) {
      console.log(err); 
      // Logs any errors that occur
    }
  },
  getPost: async (req, res) => {
    try {
      const post = await Post.findById(req.params.id); 
      // Fetches a single post by its ID
      res.render("post.ejs", { post: post, user: req.user }); 
      // Renders the post.ejs view, passing the fetched post and user info
    } catch (err) {
      console.log(err); 
      // Logs any errors that occur
    }
  },
  createPost: async (req, res) => {
    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path); 
      // Uploads the image file to Cloudinary and stores the result

      await Post.create({
        title: req.body.title,
        image: result.secure_url,
        cloudinaryId: result.public_id,
        caption: req.body.caption,
        likes: 0,
        user: req.user.id,
      }); 
      // Creates a new post in the database with the provided data
      console.log("Post has been added!"); 
      // Logs a success message
      res.redirect("/profile"); 
      // Redirects to the profile page
    } catch (err) {
      console.log(err); 
      // Logs any errors that occur
    }
  },
  likePost: async (req, res) => {
    try {
      await Post.findOneAndUpdate(
        { _id: req.params.id },
        {
          $inc: { likes: 1 },
        }
      ); 
      // Increments the likes count of the specified post by 1
      console.log("Likes +1"); 
      // Logs a success message
      res.redirect(`/post/${req.params.id}`); 
      // Redirects to the specific post page
    } catch (err) {
      console.log(err); 
      // Logs any errors that occur
    }
  },
  deletePost: async (req, res) => {
    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id }); 
      // Finds the post by its ID
      // Delete image from cloudinary
      await cloudinary.uploader.destroy(post.cloudinaryId); 
      // Deletes the image from Cloudinary using its ID
      // Delete post from db
      await Post.remove({ _id: req.params.id }); 
      // Deletes the post from the database
      console.log("Deleted Post"); 
      // Logs a success message
      res.redirect("/profile"); 
      // Redirects to the profile page
    } catch (err) {
      res.redirect("/profile"); 
      // Redirects to the profile page in case of an error
    }
  },
};