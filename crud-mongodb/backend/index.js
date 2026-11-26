const express = require("express");
const cors = require("cors");
const env = require("./config/env");
const { connectDB } = require("./config/db");
const taskRoutes = require("./routes/task.routes");
const { notFound, errorHandler } = require("./middlewares/error.middleware");

const app = express();
app.use(cors());
app.use(express.json());

app.use("/api/tasks", taskRoutes);

app.use(notFound); // shob route-er PORE
app.use(errorHandler); // ekdom shesh-e

// Age DB connect, tarpor server start
connectDB()
  .then(() =>
    app.listen(env.port, () =>
      console.log(`Server running on port ${env.port}`),
    ),
  )
  .catch((err) => {
    console.error("❌ MongoDB connection failed:", err.message);
    process.exit(1);
  });
