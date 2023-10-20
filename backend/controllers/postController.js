const User = require("../models/UserModel.js") 
const Post = require("../models/PostModel.js") 

const {v2} = require("cloudinary") 


const getFeed = async (req, res) => { 
    try {
        const userId = req.user._id  // getting user id from the request object 
        const user = await User.findById(userId)  // finding user by id

        if (!user) {
            return res.status(400).json({ error: "User not found!" }) 
        }

        const following = user.following  // getting following array from user

        const feed = await Post.find({ postedBy: {$in: following} }).sort({createdAt: -1})  // finding posts where postedBy is in following array

        res.status(200).json(feed)  // sending the response with the feed data

    } catch (err) {
        res.status(500).json({ error: err.message }) 
        console.log("Error in getPost: ", err.message) 
    }
}

const getPost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)  // finding post by id

        if (!post) { // checking if post exists
            return res.status(404).json({ message: "Post not found!" }) 
        }  
        res.status(200).json(post)  // sending the response with the post data

    } catch (err) {
        res.status(500).json({ error: err.message }) 
        console.log("Error in getPost: ", err.message) 
    }
}

const createPost = async (req, res) => {
    try {
        const {postedBy, text} = req.body 
        let {img} = req.body 

        if (!postedBy || !text) { // checking to see if needed fieldas have been filled out
            return res.status(400).json({ error: "Posted by and text fields are required!" })  
        }

        const user = await User.findById(postedBy)  

        if(!user) { // checking if user exists
            return res.status(404).json({ error: "User not found!" })  
        }

        if (user._id.toString() !== req.user._id.toString()) { //checking if current user is authorized to create post from the account
            return res.status(401).json({ error: "Unautorized to create post!" })  
        }

        const maxLength = 500  

        if (text.length > maxLength) { // checking for if given post text is greater than max length
            return res.status(400).json({ error: `Text must be less than ${maxLength} characters!` })  
        }

        if(img) { // checking if img is provided
            const uploadedResponse = await v2.uploader.upload(img)  // uploading the post picture to cloudinary
            img = uploadedResponse.secure_url  // getting the secure url from cloudinary 

        }
        const newPost = new Post({ postedBy, text, img })  // creating a new instance of the Post model
 
        await newPost.save()  // saving newPost instance to the database

        res.status(201).json({"message": "Post created!", newPost}) // sending the response with the newPost data

    } catch (err) {
        res.status(500).json({ error: err.message }) 
        console.log("Error in createPost: ", err.message) 
    } 
}

const deletePost = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)  // finding post by id

        if (!post) { // checking if post exists
            return res.status(404).json({ error: "Post not found!" }) 
        }

        if (post.postedBy.toString() !== req.user._id.toString()) { //checking if current user is authorized to delete post from the account
            return res.status(401).json({ error: "Unautorized to delete post!" })  
        }

        if (post.img) {
            const imgId = post.img.split("/").slice(-1)[0].split(".")[0]  // getting the image id from the url
            await v2.uploader.destroy(imgId)  // deleting the image from cloudinary
        }

        await Post.findByIdAndDelete(req.params.id)  // deleting post from the database

        res.status(200).json({ message: "Post deleted!" }) 
    } catch (err) {
        res.status(500).json({ error: err.message }) 
        console.log("Error in getPost: ", err.message) 
    } 
}

const likePost = async (req, res) => {
    try {
        const {id:postId} = req.params  // getting post id from the request parameters
        const userId = req.user._id  // getting user id that os attempting to like post

        const post = await Post.findById(postId)   

        if (!post) {
            res.status(404).json({ error: "Post not found!" }) 
        }

        const hasUserLiked = post.likes.includes(userId)  // checking if user has already liked the post 

        if (hasUserLiked) {
            await Post.updateOne({_id: postId}, {$pull: {likes: userId}})  // removing user from likes array
            res.status(200).json({ message: "Post unliked!" }) 
        } else {
            post.likes.push(userId)  // adding user to likes array
            res.status(200).json({ message: "Post liked!" }) 
            await post.save()  // saving post to the database
        }

    } catch (err) {
        res.status(500).json({ error: err.message })  
        console.log("Error in getPost: ", err.message) 
    }
}

const replyToPost = async (req, res) => {
	try {
        // getting the text, post id, user id, profile pic, and username from the request body
		const { text } = req.body 
		const postId = req.params.id  
		const userId = req.user._id 
		const profilePic = req.user.profilePic 
		const username = req.user.username 

		if (!text) { // if there is no text in comment, show error
			return res.status(400).json({ error: "Text field is required" }) 
		}
		const post = await Post.findById(postId) 
		if (!post) { // if post is not found, show error
			return res.status(404).json({ error: "Post not found" }) 
		}

		const reply = { userId, text, profilePic, username } // creating reply object

		post.replies.push(reply) // pushing reply object to replies array
		await post.save() 

		res.status(200).json(reply) 
	} catch (error) {
		res.status(500).json({ error: err.message }) 
	}
} 

const getUserPosts = async (req,res) => {
    const { username } = req.params // getting username from request parameters
    try {
        const user = await User.findOne({username}) // finding user by username
        if (!user) {
            return res.status(404).json({error: "User not found"}) 
        }

        const posts = await Post.find({postedBy: user._id}).sort({createdAt: -1}) // finding all posts by user and sorting them by newest first

        res.status(200).json(posts) // sending posts to the client

    } catch (error) {
        res.status(500).json({error: error.message})
    }
}
// exporting all functions
module.exports = {
    getFeed: getFeed,
    getPost: getPost,
    createPost: createPost,
    deletePost: deletePost, 
    likePost: likePost,
    replyToPost: replyToPost,
    getUserPosts: getUserPosts, 
}
