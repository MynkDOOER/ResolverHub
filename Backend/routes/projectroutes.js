import express from 'express'
import protect from '../middlewares/authMiddleware.js'
import { createProjectController, deleteProjectController, getAllProjectsController, getProjectController, updateProjectController }
 from '../controllers/projectController.js';

const routes = express.Router();

routes.post("/create", protect, createProjectController);

routes.get("/all", protect, getAllProjectsController);

routes.get("/:id", protect, getProjectController);

routes.put("/:id", protect, updateProjectController);

routes.delete("/:id", protect, deleteProjectController);

export default routes