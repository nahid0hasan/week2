const ApiError = require("../utils/ApiError");

// A MongoDB ObjectId is exactly 24 hex characters.
// (ObjectId.isValid() also accepts any 12-char string, so we check the format ourselves.)
const OBJECT_ID_REGEX = /^[a-f\d]{24}$/i;

function validateObjectId(req, res, next) {
  if (!OBJECT_ID_REGEX.test(req.params.id)) {
    throw new ApiError(400, `Invalid task id: ${req.params.id}`);
  }
  next();
}

module.exports = validateObjectId;
