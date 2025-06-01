import express from "express";
import testRouter from "./testRouter.js";
import crewRouter from "./crewRouter.js";

const router = express.Router();

router.use("/test", testRouter);
router.use("/crew", crewRouter);

export default router;
