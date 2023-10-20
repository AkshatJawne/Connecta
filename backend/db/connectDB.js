 
 const mongoose = require('mongoose')  

 const connectDB = async () => {
        try {
            const conn = await mongoose.connect(process.env.MONGO_URL, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
            }) // connect to MongoDB

            console.log(`MongoDB connection SUCCESS: ${conn.connection.host}`) 
        } catch (error) {
            console.log(`MongoDB connection FAIL: ${error}`) 
            process.exit(1) 
        }
 }

    module.exports = connectDB 