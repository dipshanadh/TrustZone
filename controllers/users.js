// Schemas
const User = require("../models/User")
const Company = require("../models/Company")

// Utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse } = require("../utils/sendResponse")

// @desc    Get a user
// @route   GET /api/user/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
	const id = req.params.id

	const user = await User.findById(id)

	if (!user)
		return sendResponse(res, false, 500, [
			{
				msg: "Could not find the user",
			},
		])

	sendResponse(res, true, 200, user)
})

// @route   GET api/user/:id/companies
// @desc    Get current user's company
// @access  Private
const getUserCompany = asyncHandler(async (req, res) => {
	if (req.user.id !== req.params.id)
		return sendResponse(res, false, 500, [
			{
				msg: "Not authorized to access this route",
			},
		])

	const company = await Company.findOne({ user: req.user.id })

	if (!company)
		return sendResponse(res, false, 500, [
			{
				msg: "The current user doesn't have any company",
			},
		])

	sendResponse(res, true, 200, company)
})

module.exports = { getUser, getUserCompany }
