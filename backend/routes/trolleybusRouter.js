import express from "express";
import { getAllTrolleybuses } from "../controllers/trolleybusController.js";

const router = express.Router();

router.get("/", getAllTrolleybuses);

export default router;
