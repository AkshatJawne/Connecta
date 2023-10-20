const jwt = require("jsonwebtoken") 
const User = require("../models/UserModel") 

const protectRoute = async (req, res, next) => {
    try {
        const token = req.cookies.jwt  // getting the token from the cookie
        if (!token) return res.status(401).json({message: "Unauthorized"})  // if there is no token, that means there is nobody logged in

        const decoded = jwt.verify(token, process.env.JWT_SECRET)  // verifying the token

        const user = await User.findById(decoded.userId).select("-password") // finding the user by id

        req.user = user  // setting the user in the request object

        next() 

    } catch (err) {
        res.status(500).json({message: err.message}) 
        console.log("Error in login", err.message) 
    }
}

module.exports = protectRoute 