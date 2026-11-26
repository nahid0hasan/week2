const { ObjectId } = require("mongodb");
const { getDB } = require("../config/db");

// Service layer: ONLY database work. Knows nothing about req/res.

const tasks = () => getDB().collection("tasks");

// Escape regex special characters so user search text is matched literally
// (otherwise "a.*" or "(" could break or slow down the query).
const escapeRegex = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");

async function findTasks({ status, priority, search, sort }) {
  const filter = {};
  if (status) filter.status = status;
  if (priority) filter.priority = priority;
  if (search) filter.title = { $regex: escapeRegex(search), $options: "i" };

  if (sort === "priority") {
    // "high" > "medium" > "low" is not alphabetical, so give each a rank first
    return tasks()
      .aggregate([
        { $match: filter },
        { $addFields: { _rank: { $indexOfArray: [["high", "medium", "low"], "$priority"] } } },
        { $sort: { _rank: 1, createdAt: -1 } },
        { $project: { _rank: 0 } },
      ])
      .toArray();
  }

  const sortBy = sort === "dueDate" ? { dueDate: 1, createdAt: -1 } : { createdAt: -1 };
  return tasks().find(filter).sort(sortBy).toArray();
}

async function findTaskById(id) {
  return tasks().findOne({ _id: new ObjectId(id) });
}

async function createTask(data) {
  const now = new Date();
  const doc = { ...data, createdAt: now, updatedAt: now };
  const result = await tasks().insertOne(doc);
  return { _id: result.insertedId, ...doc };
}

/** Returns the UPDATED document, or null if no task has that id. */
async function updateTask(id, changes) {
  return tasks().findOneAndUpdate(
    { _id: new ObjectId(id) },
    { $set: { ...changes, updatedAt: new Date() } },
    { returnDocument: "after" }
  );
}

/** Returns true if a task was deleted. */
async function deleteTask(id) {
  const result = await tasks().deleteOne({ _id: new ObjectId(id) });
  return result.deletedCount === 1;
}

module.exports = { findTasks, findTaskById, createTask, updateTask, deleteTask };
