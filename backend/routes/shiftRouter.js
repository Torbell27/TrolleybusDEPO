import express from "express";
import {
  createShift,
  endShift,
  getAllShifts,
  getActiveShifts,
  getShiftById,
  updateShift,
  deleteShift,
  getCrews,
} from "../controllers/shiftController.js";

const router = express.Router();

// Create a new shift
router.post("/", createShift);

// End a shift
router.patch("/:shift_id/end", endShift);

// Get all shifts
router.get("/", getAllShifts);

// Get active shifts
router.get("/active", getActiveShifts);

// Get shift by ID
router.get("/search/:shift_id", getShiftById);

// Update shift
router.put("/:shift_id", updateShift);

// Delete shift
router.delete("/:shift_id", deleteShift);

router.get("/crew", getCrews);

export default router;
