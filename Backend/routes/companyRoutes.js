import express from "express";
import { create, remove, update } from "../controllers/companyController.js";

const router = express.Router();

router.post("/create", protect, create);
router.delete("/delete", protect, remove);
router.put("/update", protect, update);

export default router;
