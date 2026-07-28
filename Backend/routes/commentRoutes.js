import express from "express";
import protect from "../middlewares/authMiddleware.js";
import { create, get } from "../controllers/commentController.js";

const routes = express.Router();

routes.post("/", protect, create);
routes.get("/:bugId", protect, get);

export default routes;
