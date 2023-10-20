const express = require("express")  
const router = express.Router() 
const postController = require("../controllers/postController") 

const protectRoute = require("../middlewares/protectRoute") 

// getting functions from postController
const getFeed = postController.getFeed 
const getPost = postController.getPost 
const createPost = postController.createPost 
const deletePost = postController.deletePost 
const likePost = postController.likePost 
const replyToPost = postController.replyToPost 
const getUserPosts = postController.getUserPosts

// setting up routes
router.get("/feed", protectRoute, getFeed) // protectRoute middleware is used to protect the route
router.get("/:id", getPost) // we can get the post without being logged in, thus no need for middleware
router.get("/user/:username", getUserPosts) // we can get the post without being logged in, thus no need for middleware
router.post("/create", protectRoute, createPost) // protectRoute middleware is used to protect the route
router.delete("/:id", protectRoute, deletePost) // protectRoute middleware is used to protect the route
router.put("/like/:id", protectRoute, likePost) // protectRoute middleware is used to protect the route
router.put("/reply/:id", protectRoute, replyToPost) // protectRoute middleware is used to protect the route

module.exports = router 