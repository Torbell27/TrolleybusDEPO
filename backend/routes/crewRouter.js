import express from "express";
import * as crewController from "../controllers/crewController.js";

const router = express.Router();

router.get("/getAvailableConductors", crewController.getAvailableConductors);
router.get("/getAvailableDrivers", crewController.getAvailableDrivers);

export default router;
