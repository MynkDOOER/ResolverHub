import express from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";
import dns from "dns";
import companyRoutes from "./routes/companyRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

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

app.use("/api/company", companyRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`server listening at port number: ${PORT}`);
});
