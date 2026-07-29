import express from "express";
import protect from "../middlewares/authMiddleware.js";
import {
	acceptRequest,
	denyRequest,
	getCompanyRequests,
	getNotifications,
	getProjectRequests,
	joinCompany,
	joinProject,
	markNotificationAsRead,
} from "../controllers/notificationController.js";

const routes = express.Router();

routes.post("/company/join", protect, joinCompany);
routes.post("/project/join/", protect, joinProject);
routes.get("/", protect, getNotifications);
routes.patch("/:id/read", protect, markNotificationAsRead);
routes.patch("/:id/accept", protect, acceptRequest);
routes.patch("/:id/deny", protect, denyRequest);
routes.get("/company-requests", protect, getCompanyRequests); 
routes.get("/project-requests", protect, getProjectRequests);
export default routes;
