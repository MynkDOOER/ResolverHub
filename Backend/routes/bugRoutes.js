import express from "express";
import {
  deleteBugController,
  getAllBugController,
  getBugController,
  registerBugController,
  updateBugController,
} from "../controllers/bugController.js";
import protect from "../middlewares/authMiddleware.js";

const routes = express.Router();

routes.post("/", protect, registerBugController);

routes.get("/", protect, getAllBugController);

routes.get("/:id", protect, getBugController);

routes.patch("/:id", protect, updateBugController);

routes.delete("/:id", protect, deleteBugController);

export default routes