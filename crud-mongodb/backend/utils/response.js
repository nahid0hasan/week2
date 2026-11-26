function sendSuccess(res, status, data) {
  res.status(status).json({ success: true, data });
}

function sendError(res, status, message) {
  res.status(status).json({ success: false, error: message });
}

module.exports = { sendSuccess, sendError };
