import express from "express";
import * as crewController from "../controllers/crewController.js";

const router = express.Router();

router.get("/getAvailableConductors", crewController.getAvailableConductors);
router.get("/getAvailableDrivers", crewController.getAvailableDrivers);
router.get("/getAvailableTrolleybuses", crewController.getAvailableTrolleybuses);
router.post("/createCrew", crewController.createCrew);

export default router;
