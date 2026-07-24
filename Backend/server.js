import express from 'express'
import cors from 'cors'
import 'dotenv/config'
import mongoose from 'mongoose'

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

const PORT = process.env.PORT

app.listen(PORT, ()=>{
    console.log(`server listening at port number: ${PORT}`)
})