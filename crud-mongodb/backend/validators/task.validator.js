const ApiError = require("../utils/ApiError");

// Without Mongoose there is no schema, so WE validate everything here.

const STATUSES = ["todo", "in-progress", "done"];
const PRIORITIES = ["low", "medium", "high"];
const SORTS = ["dueDate", "priority"];

/**
 * Checks each allowed field that is present in `body`.
 * Unknown fields (like _id or isAdmin) are dropped, which is a whitelist.
 * Returns a clean object, or throws ApiError(400).
 */
function pickAndValidate(body) {
  if (!body || typeof body !== "object" || Array.isArray(body)) {
    throw new ApiError(400, "Request body must be a JSON object");
  }

  const clean = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      throw new ApiError(400, "Title is required");
    }
    if (body.title.trim().length > 120) throw new ApiError(400, "Title must be at most 120 characters");
    clean.title = body.title.trim();
  }

  if (body.description !== undefined) {
    if (typeof body.description !== "string") throw new ApiError(400, "Description must be a string");
    if (body.description.length > 1000) throw new ApiError(400, "Description must be at most 1000 characters");
    clean.description = body.description.trim();
  }

  if (body.status !== undefined) {
    if (!STATUSES.includes(body.status)) {
      throw new ApiError(400, `Status must be one of: ${STATUSES.join(", ")}`);
    }
    clean.status = body.status;
  }

  if (body.priority !== undefined) {
    if (!PRIORITIES.includes(body.priority)) {
      throw new ApiError(400, `Priority must be one of: ${PRIORITIES.join(", ")}`);
    }
    clean.priority = body.priority;
  }

  if (body.dueDate !== undefined) {
    if (body.dueDate === null || body.dueDate === "") {
      clean.dueDate = null;
    } else {
      const date = new Date(body.dueDate);
      if (typeof body.dueDate !== "string" || Number.isNaN(date.getTime())) {
        throw new ApiError(400, "dueDate must be a valid date (e.g. 2026-12-31) or null");
      }
      clean.dueDate = date; // store a real Date in MongoDB, not a string
    }
  }

  return clean;
}

/** POST: title required, everything else gets a default. */
function validateCreateTask(body) {
  const clean = pickAndValidate(body);
  if (!clean.title) throw new ApiError(400, "Title is required");

  return {
    title: clean.title,
    description: clean.description ?? "",
    status: clean.status ?? "todo",
    priority: clean.priority ?? "medium",
    dueDate: clean.dueDate ?? null,
  };
}

/** PATCH: any subset of fields, but at least one. */
function validateUpdateTask(body) {
  const clean = pickAndValidate(body);
  if (Object.keys(clean).length === 0) {
    throw new ApiError(400, "Nothing to update. Send at least one of: title, description, status, priority, dueDate");
  }
  return clean;
}

/** GET /api/tasks?status=&priority=&search=&sort= */
function validateTaskQuery(query) {
  const { status, priority, search, sort } = query;

  if (status && !STATUSES.includes(status)) throw new ApiError(400, `Invalid status filter: ${status}`);
  if (priority && !PRIORITIES.includes(priority)) throw new ApiError(400, `Invalid priority filter: ${priority}`);
  if (sort && !SORTS.includes(sort)) throw new ApiError(400, `Invalid sort: ${sort}`);
  if (search !== undefined && typeof search !== "string") throw new ApiError(400, "search must be a single value");

  return {
    status: status || undefined,
    priority: priority || undefined,
    search: search?.trim() || undefined,
    sort: sort || undefined,
  };
}

module.exports = { validateCreateTask, validateUpdateTask, validateTaskQuery, STATUSES, PRIORITIES };
