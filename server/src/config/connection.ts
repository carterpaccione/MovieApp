import mongoose from 'mongoose';
import dotenv from 'dotenv';
dotenv.config();

const db = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/moviesearch')
        // mongoose.set("debug", true);
        console.log('Connected to database')
        return mongoose.connection
    } catch (error) {
        console.log('Error connecting to database', error);
        throw new Error('Error connecting to database');
    }
};

export default db;