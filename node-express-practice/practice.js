// const fs = require("fs");
// const path = require("path");

// const filePath = path.join(__dirname, "data.json");
// const newData = {
//   applications: [
//     {
//       id: 1,
//       company: "Google",
//       role: "SWE",
//       status: "Applied",
//       appliedDate: "2026-06-01",
//     },
//     {
//       id: 2,
//       company: "Microsoft",
//       role: "AI-ML",
//       status: "Applied",
//       appliedDate: "2026-07-07",
//     },
//     {
//       id: 1,
//       company: "Moon",
//       role: "SWD",
//       status: "Applied",
//       appliedDate: "2025-06-09",
//     },
//   ],
// };
// // sync (simple, block the thread)
// // const data = fs.readFileSync(filePath, "utf-8");
// // console.log(data);

// // Async (preferred in real apps)
// fs.writeFile(filePath, JSON.stringify(newData, null, 2), (errr) => {
//   if (errr) throw errr;
//   console.log("Async write completed");
// });
// // fs.readFile(filePath, "utf-8", (error, data) => {
// //   if (error) throw error;
// //   console.log(JSON.parse(data));
// // });

// NODE PRACTICE
// const http = require("http");

// const server = http.createServer((req, res) => {
//   if (req.url === "/" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "text/plain" });
//     res.end("Welcome to the job tracker api");
//   } else if (req.url === "/health" && req.method === "GET") {
//     res.writeHead(200, { "Content-Type": "application/json" });
//     res.end(JSON.stringify({ status: "ok" }));
//   } else {
//     res.writeHead(404, { "Content-Type": "text/plain" });
//     res.end("Not Found");
//   }
// });
// server.listen(1235, () => {
//   console.log("Server is running on localhost:1235");
// });

// EXPRESS PRACTICE
// const express = require("express");
// const app = express();
// app.use(express.json());
// // middleware
// app.use((req, res, next) => {
//   console.log(`${req.method} ${req.url}`);
//   next();
// });
// app.get("/", (req, res) => {
//   res.send("Welcome to the job tracker api");
// });
// app.get("/applications/:id", (req, res) => {
//   res.send(`Fetching application with id ${req.params.id}`);
// });
// app.get("/applications", (req, res) => {
//   const { status } = req.query;
//   res.send(`Filtering by ${status}`);
// });
// app.use((err, req, res, next) => {
//   console.error(err.stack);
//   res.status(500).json({ error: "Someting is wrong" });
// });
// app.listen(1235, () => {
//   console.log("Server is running on localhost:1235");
// });
