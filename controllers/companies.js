const { validationResult } = require("express-validator")

const Company = require("../models/Company")

// utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse } = require("../utils/sendResponse")

// @route	GET api/companies/:id
// @desc	Get a company
// @access	Public
const getCompany = asyncHandler(async (req, res) => {
	const company = await Company.findById(req.params.id)

	if (!company)
		return sendResponse(res, false, 404, [
			{
				msg: "The company doesn't exist",
			},
		])

	sendResponse(res, true, 200, company)
})

// @route   GET api/companies
// @desc    Get companies
// @access  Public
const getCompanies = asyncHandler(async (req, res) => {
	const companies = await Company.find()

	sendResponse(res, true, 200, companies)
})

// @route   POST api/companies
// @desc    Create a company
// @access  Private
const createCompany = asyncHandler(async (req, res) => {
	const createdCompany = await Company.findOne({ user: req.user.id })

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

// @route   PUT api/companies
// @desc    Update a company
// @access  Private
const updateCompany = asyncHandler(async (req, res) => {
	const { id } = req.params

	const company = await Company.findById(id)

	if (!company)
		return sendResponse(res, false, 404, [
			{
				msg: "The company doesn't exist",
			},
		])

	if (req.user.id !== company.user.toString())
		return sendResponse(res, false, 400, [
			{
				msg: "Not authorized to access this route",
			},
		])

	const { name, description, website, location, email, phone } = req.body

	if (name) company.name = name
	if (description) company.description = description
	if (website) company.website = website
	if (location) company.location = location
	if (email) company.email = email
	if (phone) company.phone = phone

	await company.save()

	sendResponse(res, true, 201, company)
})

module.exports = { getCompany, getCompanies, createCompany, updateCompany }
