import express from "express";

const app = express();
const PORT = 3000;

// middleware
app.use(express.json());

// routes
app.get("/", (req, res) => {});

// Start Server
const startServer = async () => {
  // app listen
  app.listen(3000, () => {
    console.log(`✅ Server started on port ${PORT}`);
  });
};

startServer();
