const express = require("express");
const taskController = require("../controllers/task.controller");
const validateObjectId = require("../middlewares/validateObjectId");

const router = express.Router();

// Mounted at /api/tasks in index.js
router.get("/", taskController.getAllTasks);
router.post("/", taskController.createTask);

router.get("/:id", validateObjectId, taskController.getTaskById);
router.patch("/:id", validateObjectId, taskController.updateTask);
router.delete("/:id", validateObjectId, taskController.deleteTask);

module.exports = router;
