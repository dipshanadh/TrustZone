const { validationResult } = require("express-validator")

const Company = require("../models/Company")

// utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse } = require("../utils/sendResponse")

// @route   GET api/companies
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

// @route   POST api/companies
// @desc    Create a company
// @access  Private
const createCompany = asyncHandler(async (req, res) => {
	const createdCompany = Company.findOne({ user: req.user.id })

	if (createdCompany)
		return sendResponse(res, false, 400, [
			{
				msg: "A user can't create more than one company",
			},
		])

	const erorrs = validationResult(req)

	if (!erorrs.isEmpty()) return sendResponse(res, false, 400, erorrs.array())

	const { name, description, website, location, email, phone } = req.body

	const company = await Company.create({
		name,
		description,
		website,
		location,
		email,
		phone,
		user: req.user.id,
	})

	sendResponse(res, true, 201, company)
})

module.exports = { getUserCompany, createCompany }
