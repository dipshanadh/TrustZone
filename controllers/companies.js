const Company = require("../models/Company")

// utils
const asyncHandler = require("../utils/asyncHandler")
const checkValidationErrors = require("../utils/checkValidationErrors")
const { sendResponse } = require("../utils/sendResponse")

// @route	GET api/companies/:id
// @desc	Get a company
// @access	Public
const getCompany = asyncHandler(async (req, res) => {
	const company = await Company.findById(req.params.id)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
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
	if (checkValidationErrors(req, res)) return

	const createdCompany = await Company.findOne({ user: req.user.id })

	if (createdCompany)
		return sendResponse(res, false, 400, [
			{ msg: "A user can't create more than one company" },
		])

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
	if (checkValidationErrors(req, res)) return

	const { id } = req.params

	const company = await Company.findById(id)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	if (req.user.id !== company.user.toString())
		return sendResponse(res, false, 400, [
			{ msg: "The company doesn't belong to the current user" },
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

// @route   DELETE api/companies
// @desc    Delete a company
// @access  Private
const deleteCompany = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	// !TODO - Remove the company's reviews

	const { id } = req.params

	const company = await Company.findById(id)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	if (req.user.id !== company.user.toString())
		return sendResponse(res, false, 400, [
			{ msg: "The company doesn't belong to the current user" },
		])

	await company.delete()

	sendResponse(res, true, 201, {})
})

module.exports = {
	getCompany,
	getCompanies,
	createCompany,
	updateCompany,
	deleteCompany,
}
