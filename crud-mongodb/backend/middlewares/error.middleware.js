const ApiError = require("../utils/ApiError");
const { sendError } = require("../utils/response");

// Runs when no route matched
function notFound(req, res) {
  sendError(res, 404, `Route not found: ${req.method} ${req.originalUrl}`);
}

// Express 5 forwards errors from async handlers here automatically,
// so controllers don't need try/catch.
// eslint-disable-next-line no-unused-vars
function errorHandler(err, req, res, next) {
  // Our own errors: 400, 404, ...
  if (err instanceof ApiError) {
    return sendError(res, err.status, err.message);
  }

  // Broken JSON in the request body (thrown by express.json())
  if (err.type === "entity.parse.failed") {
    return sendError(res, 400, "Invalid JSON in request body");
  }

  // Anything else is a bug or a DB problem: log it, hide details from the client
  console.error(err);
  sendError(res, 500, "Internal server error");
}

module.exports = { notFound, errorHandler };
