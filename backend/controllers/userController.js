const bcrypt = require("bcryptjs") 
const { restart } = require("nodemon") 
const User = require("../models/UserModel.js") 
const generateTokenAndSetCookie = require("../utils/helpers/generateTokenAndSetCookie.js") 

const {v2} = require("cloudinary") 

const mongoose = require("mongoose") 


const getUserProfile = async (req, res) => {
	// We will fetch user profile either with username or userId
	// query is either username or userId
	const { query } = req.params;

	try {
		let user;

		// query is userId
		if (mongoose.Types.ObjectId.isValid(query)) {
			user = await User.findOne({ _id: query }).select("-password").select("-updatedAt");
		} else {
			// query is username
			user = await User.findOne({ username: query }).select("-password").select("-updatedAt");
		}

		if (!user) return res.status(404).json({ error: "User not found" });

		res.status(200).json(user);
	} catch (err) {
		res.status(500).json({ error: err.message });
		console.log("Error in getUserProfile: ", err.message);
	}
};

const signupUser = async (req, res) => {
    try {
        const {name, email, username, password} = req.body  // destructuring the request body
        const user = await User.findOne({$or: [{email}, {username}]})  // the $or allows us to find the user by email or username
        
        if (user) {
            return res.status(400).json({error: "User with this email or username already exists"})  // checking if user already exists
        }

        const salt = await bcrypt.genSalt(10)  // generates a salt with 10 rounds
        const hashedPassword = await bcrypt.hash(password, salt)  // allows us to hash the password with created salt 

        const newUser = new User({name, email, username, password: hashedPassword})  // creating a new instance of the User model

        await newUser.save()  // saving newUser instance to the database

        if (newUser) { 
            generateTokenAndSetCookie(newUser._id, res) 
            res.status(201).json({
                _id: newUser._id,
                name: newUser.name, 
                email: newUser.email, 
                username: newUser.username,
                bio: newUser.bio,
                profilePicture: newUser.profilePicture,
            })  // sending the response with the newUser data
        } else {
            res.status(400).json({error: "Invalid user data"}) 
        } 

    } catch (err) {
        res.status(500).json({error: err.message}) 
        console.log("Error in signup", err.message) 
    }
}  

const loginUser = async (req, res) => {
    try {
        const {username, password} = req.body  // destructuring the request body to get login credentials
        const user = await User.findOne({username})  // finding the user by username
        const isPasswordCorrect = await bcrypt.compare(password, user?.password || "")  // checking if the user exists and if the password is correct
        if (!user || !isPasswordCorrect) return res.status(400).json({error: "Invalid username or password"})  

        generateTokenAndSetCookie(user._id, res)  // generating token and setting cookie once user has been authenticated

        res.status(200).json({ 
            _id: user._id,
            name: user.name,
            email: user.email,
            username: user.username,
            bio: user.bio,
            profilePicture: user.profilePicture,
        }) // sending the response with the user data
    } catch (err) {
        res.status(500).json({error: err.message})  
        console.log("Error in login", err.message) 
    }
} 

const logoutUser = (req, res) => {
    try {
        res.cookie("jwt", "", {maxAge: 1})  // setting the cookie to expire immediately 
        res.status(200).json({message: "User logged out"})  
    } catch (err) {
        res.status(500).json({error: err.message}) 
        console.log("Error in login", err.message) 
 
    }
} 

const followUser = async (req,res) => {
    try {
        const {id} = req.params  // getting the id of the user to follow
        const userToFollow = await User.findById(id)  // finding the user to follow
        const currentUser = await User.findById(req.user._id)  // finding the current user

        if (id === req.user._id.toString()) return res.status(400).json({error: "You cannot follow yourself"})  // checking if the user is trying to follow themselves

        if (!userToFollow || !currentUser) return res.status(400).json({error: "User not found"})  // display message if user to follow or current user does not exist in DB

        const isFollowing = currentUser.following.includes(id)  // checking if the current user is already following the user to follow

        if (isFollowing) {
            //unfollow user
            await User.findByIdAndUpdate(req.user._id, {$pull: {following: id}})  // removes followed person from following array 
            await User.findByIdAndUpdate(id, {$pull: {followers: req.user._id}})  // removes follower from followers array 
            res.status(200).json({message: "User unfollowed"}) 
        } else {
            //follow user 
            await User.findByIdAndUpdate(req.user.id, {$push: {following: id}})
            await User.findByIdAndUpdate(id, {$push: {followers: req.user._id}})
            res.status(200).json({message: "User followed"}) 
        } 

    } catch (err) {
        res.status(500).json({error: err.message}) 
        console.log("Error in following / unfollowing user", err.message) 
    }
} 

const updateUser = async (req, res) => {
    // destructuring the request body to get user information
    const {name, email, username, password, bio} = req.body   
    let {profilePic} = req.body 

    const userId = req.user._id  
    try {
        let user = await User.findById(userId)  // finding the user by id
        if (!user) return res.status(400).json({error: "User not found"})  // display message if user does not exist in DB

        if (req.params .id !== userId.toString()) { //have to convert object to string to properly compare with the id being sent with the request
            return res.status(400).json({error: "You are not authorized to update this user"})  // checking if the user is trying to update another user's profile 
        }

        if (password) {
            const salt = await bcrypt.genSalt(10)  // generates a salt with 10 rounds
            const hashedPassword = await bcrypt.hash(password, salt)  // allows us to hash the password with created salt
            user.password = hashedPassword  // setting the user password to the hashed password
        }

        if (profilePic) {
            if (user.profilePic) {
                await v2.uploader.destroy(user.profilePic.split("/".pop().split(".")[0] ))
            }
            const uploadedResponse = await v2.uploader.upload(profilePic)  // uploading the profile picture to cloudinary
            profilePic = uploadedResponse.secure_url  // setting the profilePic to the uploaded image url
        }

        user.name = name || user.name  // setting the user name to the new name or the old name
        user.email = email || user.email  // setting the user email to the new email or the old email
        user.username = username || user.username  // setting the user username to the new username or the old username
        user.profilePic = profilePic || user.profilePic  // setting the user profilePic to the new profilePic or the old profilePic
        user.bio = bio || user.bio  // setting the user bio to the new bio or the old bio
        
        user =  await user.save()  // saving the updated user to the database

        user.password = null  // setting the password to null so it is not sent in the response

        res.status(200).json(user)  // sending the response with the updated user data


    } catch (err) { 
        res.status(500).json({error: err.message})  
        console.log("Error in updating user", err.message) 
    }
}
// exporting the functions to be used in the routes
module.exports = {
    getUserProfile: getUserProfile,
    signupUser: signupUser, 
    loginUser: loginUser,
    logoutUser: logoutUser,
    followUser: followUser,
    updateUser: updateUser,
}


