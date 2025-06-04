import express from "express";
import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  searchMaintenanceRecords,
  completeMaintenanceRecord,
} from "../controllers/maintenanceRecordController.js";

const router = express.Router();

// Роуты для записей о ТО
router.post("/", createMaintenanceRecord);
router.get("/", getAllMaintenanceRecords);
router.get("/get/:id", getMaintenanceRecordById);
router.put("/:id", updateMaintenanceRecord);
router.delete("/:id", deleteMaintenanceRecord);
router.get("/search", searchMaintenanceRecords);
router.put("/complete/:id", completeMaintenanceRecord);

export default router;
