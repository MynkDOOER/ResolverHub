import express from "express";
import { create, getProjectAdmins, remove, update } from "../controllers/companyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, create);
router.get("/free-members", protect, getProjectAdmins);
router.delete("/:companyId", protect, remove);
router.put("/:companyId", protect, update);

export default router;
