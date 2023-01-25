const Company = require("../models/Company")
const Reviews = require("../models/Reviews")

// utils
const asyncHandler = require("../utils/asyncHandler")
const checkValidationErrors = require("../utils/checkValidationErrors")
const { sendResponse } = require("../utils/sendResponse")

// @route	GET api/companies/:id/reviews
// @desc	Get reviews of a company
// @access	Public
const getReviews = asyncHandler(async (req, res) => {
	const company = await Company.findById(req.params.id)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const reviews = await Reviews.find({ company: req.params.id })

	sendResponse(res, true, 200, reviews)
})

module.exports = { getReviews }
