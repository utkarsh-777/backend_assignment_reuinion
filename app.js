import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';

import bodyparser from 'body-parser';
import cors from 'cors';

const app = express();
dotenv.config();

const PORT =  process.env.PORT || 5000
import keys from "./keys.js";

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({extended: false}));
app.use(cors());

import authRoutes from "./routes/authRoutes.js";
import postRoutes from "./routes/postRoutes.js";
import userRoutes from "./routes/userRoutes.js";

mongoose.connect(keys.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected',()=>{
    console.log('DB CONNECTED')
});

mongoose.connection.on('error',(err)=>{
    console.log('Error in connection',err)
});

app.use("/api/authenticate", authRoutes);
app.use("/api", postRoutes);
app.use("/api", userRoutes);

app.listen(PORT,()=>{
    console.log(`Listening at PORT ${PORT}`);
});

