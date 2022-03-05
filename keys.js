import dotenv from 'dotenv';

dotenv.config();

export default {
    SECRET: process.env.SECRET,
    MONGO_URI: process.env.MONGO_URI,
}