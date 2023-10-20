const express = require("express") 
const router = express.Router() 
const userController = require("../controllers/userController") 
const protectRoute = require("../middlewares/protectRoute") 

// getting functions from userController
const getUserProfile = userController.getUserProfile  
const signupUser = userController.signupUser  
const loginUser = userController.loginUser 
const logoutUser = userController.logoutUser 
const followUser = userController.followUser 
const updateUser = userController.updateUser 

router.get("/profile/:query", getUserProfile) // we can get the profile without being logged in, thus no need for middleware
router.post("/signup", signupUser) // upon sign up, there will be no username, thus no need for middleware
router.post("/login", loginUser)  // upon login, there will be no username, thus no need for middleware
router.post("/logout", logoutUser) // protectRoute middleware is used to protect the route
router.post("/follow/:id", protectRoute, followUser) // protectRoute middleware is used to protect the route
router.put("/update/:id", protectRoute, updateUser) // protectRoute middleware is used to protect the route

module.exports = router   


