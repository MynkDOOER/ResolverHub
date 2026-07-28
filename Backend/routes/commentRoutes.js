import express from "express";
import protect from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post("/", protect);
routes.get("/:bugId", protect);
routes.
