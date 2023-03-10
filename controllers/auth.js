const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const User = require("../models/User")

// utils
const asyncHandler = require("../utils/asyncHandler")
const checkValidationErrors = require("../utils/checkValidationErrors")
const { sendResponse, sendToken } = require("../utils/sendResponse")

// @desc    Get auth user
// @route   GET api/auth
// @access  Private
const getAuthUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id)

	if (!user)
		return sendResponse(res, false, 404, [
			{
				message: "Could not find the user",
			},
		])

	sendResponse(res, true, 200, user)
})

// @desc    Login user
// @route   POST api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const { email, password } = req.body

	const user = await User.findOne({ email }).select("password")

	if (!user)
		return sendResponse(res, false, 400, [
			{
				msg: "No user found with the email",
			},
		])

	const isMatched = await bcrypt.compare(password, user.password)

	if (!isMatched)
		return sendResponse(res, false, 400, [
			{
				msg: "Incorrect password",
			},
		])

	const payload = { id: user.id }

	sendToken(res, payload)
})

// @desc	Register user
// @route   POST api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const { name, email, password } = req.body

	const createdUser = await User.findOne({ email })

	if (createdUser)
		return sendResponse(res, false, 400, [
			{
				msg: "User already exists with the email",
			},
		])

	const salt = await bcrypt.genSalt(10)
	const encryptedPassword = await bcrypt.hash(password, salt)

	const user = await User.create({
		name,
		email,
		password: encryptedPassword,
	})

	const payload = { id: user.id }

	sendToken(res, payload)
})

module.exports = { getAuthUser, login, register }
