import cors from "cors";
import dns from "dns";
import dotenv from "dotenv";
import express from "express";
import mongoose from "mongoose";

import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import companyRoutes from "./routes/companyRoutes.js";
import projectRoutes from "./routes/projectRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import bugRoutes from "./routes/bugRoutes.js";
import commentRoutes from "./routes/commentRoutes.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config({
	path: "../.env",
	override: true,
});

const app = express();

app.use(cors());
app.use(express.json());

const connectDB = async () => {
	try {
		await mongoose.connect(process.env.MONGODB_URI);
		console.log("MONGODB CONNECTED✅");
	} catch (err) {
		console.log("error while connecting to DB:", err.message);
	}
};

await connectDB();

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/company", companyRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/bugs", bugRoutes);
app.use("/api/comments", commentRoutes);

const PORT = process.env.PORT;

app.listen(PORT, () => {
	console.log(`server listening at port number: ${PORT}`);
});
