import express from "express";
import apiRouter from "./routes/api.js";
import { db } from "./db/index.js";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// routes
app.use("/api/v1", apiRouter);

// Start Server
const startServer = async () => {
  // connect to db
  try {
    await db.connect();
    console.log("✅ Connected to database");

    // app listen
    app.listen(3000, () => {
      console.log(`✅ Server started on port ${PORT}`);
    });
  } catch (error) {
    console.log(error, "❌ Error connecting to database");
  }
};

startServer();
