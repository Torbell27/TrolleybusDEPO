import express from "express";
import crewRouter from "./crewRouter.js";
import mCrewRouter from "./maintenanceCrewRouter.js";
import mRecordRouter from "./maintenanceRecordRouter.js";

const router = express.Router();

router.use("/crew", crewRouter);
router.use("/maintenance-crew", mCrewRouter);
router.use("/maintenance-record", mRecordRouter);

export default router;
