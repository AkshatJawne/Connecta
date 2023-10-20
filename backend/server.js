
const express = require("express") 
const dotenv = require("dotenv") 
const connectDB = require("./db/connectDB") 
const cookieParser = require("cookie-parser") 

const userRoutes = require("./routes/userRoutes") 
const postRoutes = require("./routes/postRoutes") 
let {v2} = require("cloudinary") 

dotenv.config() // to use environment variables
connectDB() // to connect to the database

const app = express()  

const PORT = process.env.PORT 

v2.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRET,
}) // setting up cloudinary



app.use(express.json({limit: '50mb'}))  // to parse json data in the request body
app.use(express.urlencoded({ extended: true }))  // to parse form data in the request body
app.use(cookieParser())  // to parse cookies from the request and add cookies to the response

// Routes
app.use("/api/users", userRoutes) 
app.use("/api/posts", postRoutes) 

 
app.listen(PORT, () => 
    console.log(`Server started at http://localhost:${PORT}`)
)
