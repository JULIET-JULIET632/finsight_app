import express from "express";
import cors from "cors";
import finsightRoutes from "./routes/finsight.routes.js";
import errorHandler from "./middleware/errorHandler.js";

const app = express();

// 1. Move CORS to the top
app.use(cors());

// 2. Use BOTH standard and detailed JSON parsing
app.use(express.json({ limit: '10mb' })); 
app.use(express.urlencoded({ extended: true }));

// 3. ADD THIS DEBUGGER RIGHT HERE (Before routes)
app.use((req, res, next) => {
  console.log(`🔍 Middleware intercept: ${req.method} ${req.url}`);
  console.log("🔍 Content-Type:", req.headers['content-type']);
  next();
});

app.use("/api", finsightRoutes);

app.use(errorHandler);

export default app;