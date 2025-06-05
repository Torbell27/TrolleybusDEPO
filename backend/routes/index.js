import express from "express";
import crewRouter from "./crewRouter.js";
import mCrewRouter from "./maintenanceCrewRouter.js";
import mRecordRouter from "./maintenanceRecordRouter.js";
import technicianRouter from "./technicianRouter.js";
import trolleybusRouter from "./trolleybusRouter.js";
import shiftRouter from "./shiftRouter.js";

const router = express.Router();

router.use("/crew", crewRouter);
router.use("/maintenance-crew", mCrewRouter);
router.use("/maintenance-record", mRecordRouter);
router.use("/technician", technicianRouter);
router.use("/trolleybus", trolleybusRouter);
router.use("/shift", shiftRouter);

export default router;
