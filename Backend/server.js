import cors from "cors";
import dns from "dns";
dns.setServers(["8.8.8.8", "8.8.4.4"]);
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";

dotenv.config({
	path: "../.env",
	override: true,
});

dns.setServers(["8.8.8.8", "8.8.4.4"]); // Remove this later. Only for development because it doesn't work

const app = express();

app.use(cors());

app.use(express.json());

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MONGODB CONNECTED✅");
	} catch (err) {
		console.log("error while conncting to DB: ", err.message);
	}
};

connectDB();

app.use("/api/v1/auth", authRoutes);
app.use("/api/company", companyRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`server listening at port number: ${PORT}`);
});
