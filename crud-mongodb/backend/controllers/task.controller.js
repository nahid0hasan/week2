const taskService = require("../services/task.service");
const ApiError = require("../utils/ApiError");
const { sendSuccess } = require("../utils/response");
const { validateCreateTask, validateUpdateTask, validateTaskQuery } = require("../validators/task.validator");

// Controller layer: read req → validate → call service → send res.
// No try/catch needed: Express 5 sends thrown/rejected errors to the error middleware.

// GET /api/tasks
exports.getAllTasks = async (req, res) => {
  const filters = validateTaskQuery(req.query);
  const tasks = await taskService.findTasks(filters);
  sendSuccess(res, 200, tasks);
};

// GET /api/tasks/:id
exports.getTaskById = async (req, res) => {
  const task = await taskService.findTaskById(req.params.id);
  if (!task) throw new ApiError(404, "Task not found");
  sendSuccess(res, 200, task);
};

// POST /api/tasks
exports.createTask = async (req, res) => {
  const data = validateCreateTask(req.body);
  const task = await taskService.createTask(data);
  sendSuccess(res, 201, task);
};

// PATCH /api/tasks/:id
exports.updateTask = async (req, res) => {
  const changes = validateUpdateTask(req.body);
  const task = await taskService.updateTask(req.params.id, changes);
  if (!task) throw new ApiError(404, "Task not found");
  sendSuccess(res, 200, task);
};

// DELETE /api/tasks/:id
exports.deleteTask = async (req, res) => {
  const deleted = await taskService.deleteTask(req.params.id);
  if (!deleted) throw new ApiError(404, "Task not found");
  sendSuccess(res, 200, { _id: req.params.id });
};
