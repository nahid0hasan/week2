const express = require("express");
const router = express.Router();
const {
  getAllApplications,
} = require("../controllers/applications.controller.js");

// Get all applications (supports filter/sort/pagination)
router.get("/", () => getAllApplications);

// Get application count by status
router.get("/stats", () => {});

// Get a single application by id
router.get("/:id", () => {});

module.exports = router;
