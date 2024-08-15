const cloudinary = require("../middleware/cloudinary");
// this code imports cloudinary
// creating account in cloudinary, to work with images
// supports a host of different programing languages
// needs an api key to connect cloudinary
// need cloud name, cloud key, and cloud api secret key
//needs to be installed in terminal first
// Cloudinary improves image management by providing faster loading, easy edits, global delivery, handling many images, security, and reducing server load.
//Cloudinary is useful for e-commerce, social media, blogs, news sites, portfolios, travel sites, and educational platforms to manage and optimize images and videos efficiently.
const Post = require("../models/Post");
const Comment = require("../models/Comment");
// accesses the file that is used to interact with the posts collection in the MongoDB database

module.exports = {
  // Exports an object containing various methods so they can be used in other parts of the application.

  // object containing various methods such ad:
  // 1.	getProfile: Retrieves and displays the posts of the logged-in user.
  // 2.	getFeed: Retrieves and displays all posts in a sorted order.
  // 3.	getPost: Retrieves and displays a specific post by its ID.
  // 4.	createPost: Handles the creation of a new post, including image upload to Cloudinary.
  // 5.	likePost: Increments the like count of a specific post.
  // 6.	deletePost: Deletes a specific post and its associated image from Cloudinary.

  //in this case getProfile is used 

  getProfile: async (req, res) => {
    // Defines an asynchronous function named getProfile that takes request (req) and response (res) objects as arguments.
    //the req object provides access to request data, and the res object is used to send responses back to the client.
    try {
      // Starts a try block to handle any potential errors within the block.
      const posts = await Post.find({ user: req.user.id });
      // Uses the Post model to find all posts where the user field matches the logged-in user's ID, and waits for the result.
      // Fetches posts created by the logged-in user
      //This means the code looks for and retrieves all posts made by the currently logged-in user. It uses the user’s ID to find these posts and waits for the results before continuing.
      res.render("profile.ejs", { posts: posts, user: req.user });
      // Renders the profile.ejs view, passing the fetched posts and user info
      //This means the code shows the “profile.ejs” page to the user, including the posts and user information.
    } catch (err) {
      console.log(err);
      // Logs any errors that occur
    }
  },
  getFeed: async (req, res) => {

    //  getFeed: async (req, res) => {
    //     •	Purpose: Fetches and displays all posts for the feed page.
    //The “feed page” is a section of the website where users can see a list of all posts (typically most recent posts first), various posts made by different users.
    //     •	Functionality: Retrieves all posts from the database, sorts them by creation date in descending order, and renders the “feed.ejs” view with these posts.

    try {
      const posts = await Post.find().sort({ createdAt: "desc" }).lean();
      // Fetches all posts, sorted by creation date in descending order, and converts them to plain JavaScript objects
      res.render("feed.ejs", { posts: posts });
      // Renders the feed.ejs view, passing the fetched posts
      //   •	It uses the res.render method to display a webpage.
      //   •	The webpage template being used is “feed.ejs”.
      //   •	It sends the list of posts (stored in the posts variable) to the “feed.ejs” template.
      //   •	This allows the “feed.ejs” page to show the fetched posts to the user.
    } catch (err) {
      console.log(err);
      // Logs any errors that occur
    }
  },
  getPost: async (req, res) => {

    //  getPost: async (req, res) => {
    // •	Purpose: Fetches and displays a single post by its ID.
    // •	Functionality: Retrieves a specific post from the database using the post ID from the request parameters, and renders the “post.ejs” view with this post and user information.

    try {
      const post = await Post.findById(req.params.id);
      const comments = await Comment.find({ postId: req.params.id});
      // if (!comments) {
      //   comments = 'none'
      // }
      // const comment = await Post.findById(req.params.id); 
      // Fetches a single post by its ID
      //   •	Uses the Post model to find a post in the database.
      //   •	Looks for the post using the ID provided in the request parameters (req.params.id).
      //   •	Waits for the database operation to complete.
      //   •	Stores the found post in the post variable.
      res.render("post.ejs", { post: post, user: req.user , comments: comments});
      // Renders the post.ejs view, passing the fetched post and user info
      //   •	Uses the res.render method to display a webpage.
      //   •	The webpage template being used is “post.ejs”.
      //   •	It sends the fetched post (stored in the post variable) and the user information (req.user) to the “post.ejs” template.
      //   •	This allows the “post.ejs” page to show the specific post and user information to the user.
    } catch (err) {
      console.log(err);
      // Logs any errors that occur
    }
  },
  createPost: async (req, res) => {

    // 3.	createPost: async (req, res) => {
    //     •	Purpose: Creates a new post and saves it to the database.
    //     •	Functionality: Uploads an image to Cloudinary, creates a new post in the database with the provided title, image URL, Cloudinary ID, caption, and user ID, and then redirects to the profile page.

    try {
      // Upload image to cloudinary
      const result = await cloudinary.uploader.upload(req.file.path);
      // Uploads the image file to Cloudinary and stores the result
      // •	Uses Cloudinary’s uploader to upload an image file.
      // •	The image file is located at the path specified by req.file.path.
      // •	Waits for the upload to complete.
      // •	Stores the upload result (which includes information about the uploaded image) in the result variable.      

      await Post.create({
        // •	Creates a new post in the database.
        // •	Waits for the creation process to complete.
        title: req.body.title,
        // •	Sets the title of the post using the value from the request body.
        image: result.secure_url,
        // •	Sets the image URL of the post using the secure URL from the Cloudinary upload result.
        cloudinaryId: result.public_id,
        // •	Sets the Cloudinary ID of the post using the public ID from the Cloudinary upload result.
        caption: req.body.caption,
        // •	Sets the caption of the post using the value from the request body.
        likes: 0,
        // •	Initializes the number of likes for the post to 0.
        user: req.user.id,
        // •	Associates the post with the logged-in user by setting the user ID.
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

    // likePost: async (req, res) => {
    //     •	Purpose: Increases the like count of a specific post.
    //     •	Functionality: Finds a post by its ID from the request parameters, increments its like count by 1, and redirects to the specific post page.

    try {
      // •	Starts a block of code that will try to run, and catches any errors if they occur.
      await Post.findOneAndUpdate(
        // •	Uses the Post model to find a specific post in the database and update it.
        // •	Waits for the update to complete.
        { _id: req.params.id },
        // •	Specifies the search criteria to find the post by its ID, which is provided in the request parameters (req.params.id).
        {
          $inc: { likes: 1 },
        }
      );
      // Increments the likes count of the specified post by 1
      //   •	Specifies the update operation to increase the likes field by 1 using MongoDB’s $inc operator.
      console.log("Likes +1");
      // Logs a success message
      res.redirect(`/post/${req.params.id}`);
      // Redirects to the specific post page
      //   •	Redirects the user to the page of the specific post they just liked.
      //   •	For example, if the post ID is 12345, it redirects the user to /post/12345.

      //   someone called 	•	AJAX Implementation: Updates the like count dynamically on the same page without redirection.

    } catch (err) {
      console.log(err);
      // Logs any errors that occur
    }
  },
  deletePost: async (req, res) => {

    // 5.	deletePost: async (req, res) => {
    //     •	Purpose: Deletes a specific post.
    //     •	Functionality: Finds a post by its ID from the request parameters, deletes the associated image from Cloudinary, removes the post from the database, and then redirects to the profile page.


    try {
      // Find post by id
      let post = await Post.findById({ _id: req.params.id });
      // Finds the post by its ID

      //   •	Finds a specific post in the database using its ID.
      //   •	The ID is taken from the request parameters (req.params.id).
      //   •	Waits for the database to return the post and stores it in the post variable.

      // Delete image from cloudinary

      //	•	The next step will delete the image associated with this post from Cloudinary.

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
  addComment: async (req, res) => {
    console.log(req.body)
    console.log(req.params)
    try {

      await Comment.create({
        comment: req.body.commentItem,
        postId: req.params.id,
        user: req.user.id,
      });
      
      console.log("Comment has been added!");
      res.redirect(`/post/${req.params.id}`);
    } catch (err) {
      console.log(err);
    }
  },
};