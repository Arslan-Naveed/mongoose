const mongoose = require('mongoose');

require('dotenv').config();



    const connectDB = async () => {
        try {
            mongoose.set('strictQuery', true);          
            const connection = await mongoose.connect(process.env.MONGO_URI, {
                useNewUrlParser: true,
            });
            console.log(`MongoDB connected successfully to ${connection.connection.host}`);
            return connection;
        } catch (error) {
            console.error('MongoDB connection failed:', error.message);
            // Exit process with failure code on connection error
            process.exit(1);
        }
    };
    
   
    module.exports = connectDB;