const express = require("express");
const router = express.Router();
const controller = require("../controllers/applications.controller.js");

// Get all applications (supports filter/sort/pagination)
router.get("/", controller.getAllApplications);

// Get application count by status
router.get("/stats", controller.getStats);

// Get a single application by id
router.get("/:id", controller.getApplicationByID);

// Create a new application
router.post("/", controller.createApplication);

// Partially update an application
router.patch("/:id", controller.updateApplicatoin);

// Delete an application
router.delete("/:id", controller.deleteApplication);

module.exports = router;
