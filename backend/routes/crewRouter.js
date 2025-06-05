import express from "express";
import * as crewController from "../controllers/crewController.js";

const router = express.Router();

router.get("/getAvailableConductors", crewController.getAvailableConductors);
router.get("/getAvailableDrivers", crewController.getAvailableDrivers);
router.get("/getAvailableTrolleybuses", crewController.getAvailableTrolleybuses);
router.get("/getCrews", crewController.getCrews);
router.post("/createCrew", crewController.createCrew);
router.delete("/deleteCrew/:crewId", crewController.deleteCrew);
router.put("/updateDriver/:crewId", crewController.updateDriver);
router.put("/updateConductor/:crewId", crewController.updateConductor);
router.put("/updateTrolleybus/:crewId", crewController.updateTrolleybus);

export default router;
