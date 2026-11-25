const fs = require("fs");
const path = require("path");
const db = path.join(__dirname, "../data.json");

function readData() {
  const rawData = fs.readFileSync(db, "utf-8");
  return JSON.parse(rawData).applications;
}

function writeData(applications) {
  fs.writeFileSync(db, JSON.stringify({ applications }, null, 2));
}

function sendSuccess(res, status, data) {
  res.status(status).json({ success: true, data });
}

function sendError(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

exports.getAllApplications = (req, res) => {
  const { status, sort, page, limit } = req.query;
  let result = readData();
  if (status) {
    result = result.filter((app) => app.status === status);
  }
  if (sort === "date") {
    result = result
      .slice()
      .sort((a, b) => (a.appliedDate > b.appliedDate ? 1 : -1));
  }
  if (page && limit) {
    const pageNum = Number(page);
    const limitNum = Number(limit);
    const start = (pageNum - 1) * limitNum;

    result = result.slice(start, start + limitNum);
  }

  sendSuccess(res, 200, result);
};

exports.getApplicationByID = (req, res) => {
  const id = Number(req.params.id);
  const application = readData().find((app) => app.id === id);
  if (!application) {
    return sendError(res, 404, "Application is not found");
  }
  sendSuccess(res, 200, application);
};

// Tally up applications per status, e.g. {applied:2, interview:1}.
exports.getStats = (req, res) => {};

exports.createApplication = (req, res) => {
  const { company, role, status } = req.body;

  if (!company && !role) {
    return sendError(res, 400, "Company and role are required");
  }
  const applications = readData();
  const nextId =
    applications.length > 0
      ? Math.max(...applications.map((app) => app.id)) + 1
      : 1;

  const appliedDate = new Date().toISOString().split("T")[0];
  const newApplication = {
    id: nextId,
    company,
    role,
    status: status || "applied",
    appliedDate,
  };
  applications.push(newApplication);
  writeData(applications);
  sendSuccess(res, 201, newApplication);
};

exports.updateApplicatoin = (req, res) => {
  const id = Number(req.params.id);
  const applications = readData();
  const application = applications.find((app) => app.id === id);

  if (!application) {
    sendError(res, 404, "Application is not found");
  }
  const { company, role, status } = req.body;
  if (company !== undefined) application.company = company;
  if (role !== undefined) application.role = role;
  if (status !== undefined) application.status = status;

  writeData(applications);
  sendSuccess(res, 200, application);
};

exports.deleteApplication = (req, res) => {
  const id = Number(req.params.id);
  const applications = readData();
  const index = applications.findIndex((app) => app.id === id);
  if (index === -1) {
    sendError(res, 404, "Application is not found");
  }
  applications.splice(index, 1);
  writeData(applications);
  res.status(204).end();
};
