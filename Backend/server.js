import dns from 'dns';
dns.setServers(['8.8.8.8', '8.8.4.4']);
import express from 'express'
import cors from 'cors'

import mongoose from 'mongoose'
import authRoutes from './routes/authRoutes.js'
import profileRoutes from './routes/profileRoutes.js'

import dotenv from 'dotenv';

dotenv.config({
  path: '../.env'
});

const app = express()

app.use(cors())

app.use(express.json())

const connectDB = async()=>{

    try {
        await mongoose.connect(process.env.MONGODB_URI)
        console.log("MONGODB CONNECTED✅")
    } catch (err) {
        console.log("error while conncting to DB", err.message)
    }
}

connectDB();

app.use('/api/auth', authRoutes)
app.use('/api/profile', profileRoutes)

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})