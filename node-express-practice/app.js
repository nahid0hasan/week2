const express = require("express");
const applicationsRouter = require("./routes/applications.routes.js");
const app = express();
app.use(express.json());

app.use((req, res, next) => {
  console.log(`${req.method} ${req.url}`);
  next();
});

app.get("/", (req, res) => {
  res.send("Welcome to the job tracker api");
});

app.use("/applications", applicationsRouter);

app.use((req, res) => {
  res.status(404).json({ success: false, error: "Route not found" });
});

app.use((err, req, res, next) => {
  console.log(err.stack);
  res.status(500).json({ success: false, error: "Internal server error" });
});

app.listen(1235, () => {
  console.log("The app is running on localhost:1235");
});
