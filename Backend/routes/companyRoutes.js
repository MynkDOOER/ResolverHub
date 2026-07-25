import express from "express";
import { create, remove, update } from "../controllers/companyController.js";
import protect from "../middlewares/authMiddleware.js";

const router = express.Router();

router.post("/", protect, create);
router.delete("/:companyId", protect, remove);
router.put("/:companyId", protect, update);

export default router;
