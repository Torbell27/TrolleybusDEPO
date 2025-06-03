import express from "express";
import {
  createMaintenanceRecord,
  getAllMaintenanceRecords,
  getMaintenanceRecordById,
  updateMaintenanceRecord,
  deleteMaintenanceRecord,
  searchMaintenanceRecords,
} from "../controllers/maintenanceRecordController.js";

const router = express.Router();

// Роуты для записей о ТО
router.post("/create", createMaintenanceRecord);
router.get("/get", getAllMaintenanceRecords);
router.get("/get/:id", getMaintenanceRecordById);
router.put("/:id", updateMaintenanceRecord);
router.delete("/:id", deleteMaintenanceRecord);
router.get("/search", searchMaintenanceRecords);

export default router;
