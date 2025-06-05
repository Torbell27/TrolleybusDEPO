import express from "express";
import { getAllTechnicians } from "../controllers/technicianController.js";

const router = express.Router();

router.get("/", getAllTechnicians);

export default router;
