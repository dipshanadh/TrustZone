const Company = require("../models/Company")

// utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse } = require("../utils/sendResponse")

// @route   Get api/companies
// @desc    Get current user's company
// @access  Private
const getUserCompany = asyncHandler(async (req, res) => {
	if (req.user.id !== req.params.id)
		return sendResponse(res, false, 500, [
			{
				value: req.user.id,
				msg: "Not authorized to access this route",
				param: "id",
			},
		])

	const company = await Company.findOne({ user: req.user.id })

	if (!company)
		return sendResponse(res, false, 500, [
			{
				value: req.user.id,
				msg: "There is no company for the current user",
				param: "id",
			},
		])

	sendResponse(res, true, 200, company)
})

module.exports = { getUserCompany }
