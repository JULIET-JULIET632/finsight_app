import express from "express";
import { getDiagnosis } from "../controller/health.controllers.js";
import { simulate } from "../controller/simulate.controller.js"; // New: For the sliders
import { getCoachAdvice } from "../controller/coach.controller.js";
import { downloadReport } from "../controller/report.controller.js";

const router = express.Router();

/**
 * STEP 1: INITIAL DIAGNOSIS
 * Triggered by: "Calculate Risk" button
 * Purpose: Gets the 1st score and the "Score Explained" paragraph.
 */
router.post("/diagnose", getDiagnosis);

/**
 * STEP 2: REAL-TIME SIMULATION
 * Triggered by: Moving sliders OR clicking "See Impact"
 * Purpose: Updates the score math (Python) and generates "Benefits" (Groq).
 */
router.post("/simulate", simulate);

/**
 * STEP 3: STRATEGIC COACHING
 * Triggered by: Loading the final "Coach Recommendations" page
 * Purpose: Returns the "Action Steps" and "Growth Tips" columns.
 */
router.post("/coach", getCoachAdvice);

/**
 * STEP 4: GENERATE PDF REPORT
 * Triggered by: "Download Report" button
 * Purpose: Creates the final document with all simulated data.
 */
router.post("/report/download", downloadReport);

export default router;