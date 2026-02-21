import express from "express";
import healthCheck from "../controller/health.controllers.js"; // default export
import { getCoachAdvice } from "../controller/coach.controller.js"; // assuming named export

const router = express.Router();

router.post("/diagnose", healthCheck); // use default import here
router.post("/coach", getCoachAdvice);

export default router;