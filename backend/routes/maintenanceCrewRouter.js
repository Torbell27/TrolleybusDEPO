import express from "express";
import {
  createMaintenanceCrew,
  getAllMaintenanceCrews,
  getMaintenanceCrewById,
  updateMaintenanceCrew,
  deleteMaintenanceCrew,
  searchMaintenanceCrewsByStatus,
} from "../controllers/maintenanceCrewController.js";

const router = express.Router();

// Роуты для ремонтных бригад
router.post("/create", createMaintenanceCrew);
router.get("/get", getAllMaintenanceCrews);
router.get("/get/:id", getMaintenanceCrewById);
router.put("/:id", updateMaintenanceCrew);
router.delete("/:id", deleteMaintenanceCrew);
router.get("/search", searchMaintenanceCrewsByStatus);

export default router;
