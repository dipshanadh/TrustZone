const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const User = require("../models/User")

// utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse, sendToken } = require("../utils/sendResponse")

// @desc    Get auth user
// @route   GET api/auth
// @access  Private
const getAuthUser = asyncHandler(async (req, res) => {
	const user = await User.findById(req.user.id)

	sendResponse(res, true, 200, user)
})

// @desc    Login user
// @route   POST api/auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return sendResponse(res, false, 400, errors.array())

	const { email, password } = req.body

	const user = await User.findOne({ email }).select("password")

	if (!user)
		return sendResponse(res, false, 400, [
			{
				value: email,
				msg: "No user found with the email",
				param: "email",
				location: "body",
			},
		])

	const isMatched = await bcrypt.compare(password, user.password)

	if (!isMatched)
		return sendResponse(res, false, 400, [
			{
				value: password,
				msg: "Incorrect password",
				param: "password",
				location: "body",
			},
		])

	const payload = { id: user.id }

	sendToken(res, payload)
})

// @desc	Register user
// @route   POST api/auth/register
// @access  Public
const register = asyncHandler(async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty()) return sendResponse(res, false, 400, errors.array)

	const { name, email, password } = req.body

	const createdUser = await User.findOne({ email })

	if (createdUser)
		return sendResponse(res, false, 400, [
			{
				value: email,
				msg: "User already exists with the email",
				param: "email",
				location: "body",
			},
		])

	const user = new User({ name, email, password })

	const salt = await bcrypt.genSalt(10)

	user.password = await bcrypt.hash(password, salt)

	await user.save()

	const payload = { id: user.id }

	sendToken(res, payload)
})

module.exports = { getAuthUser, login, register }
