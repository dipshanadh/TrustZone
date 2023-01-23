const { validationResult } = require("express-validator")

// utils
const { sendResponse } = require("./sendResponse")

// Returns true if there are validation errors
const checkValidationErrors = (req, res) => {
	const erorrs = validationResult(req)

	if (!erorrs.isEmpty()) {
		sendResponse(res, false, 400, erorrs.array())
		return true
	}
}

module.exports = checkValidationErrors
