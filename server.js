import "dotenv/config"; 
import app from "./src/app.js";

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`🚀 Server strictly listening on port ${PORT}`);
  console.log("Environment Check - Key exists:", !!process.env.GROQ_API_KEY);
});

// This prevents the "clean exit" by catching errors that might be closing the loop
server.on('error', (e) => {
  console.error("❌ Server Error:", e);
});