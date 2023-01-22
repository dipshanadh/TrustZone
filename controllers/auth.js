const { validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

// @desc    Get auth user
// @route   GET api/auth
// @access  Private
const getAuthUser = async (req, res) => {
	try {
		const user = await User.findById(req.user.id)

		res.status(200).json({
			success: true,
			data: user,
		})
	} catch (err) {
		console.error(err.message)

		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	}
}

// @desc    Login user
// @route   POST api/auth/login
// @access  Public
const login = async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty())
		return res.status(400).json({
			success: false,
			errors: errors.array(),
		})

	try {
		const { email, password } = req.body

		const user = await User.findOne({ email }).select("password")

		if (!user)
			return res.status(400).json({
				success: false,
				errors: [
					{
						value: email,
						msg: "No user found with the email",
						param: "email",
						location: "body",
					},
				],
			})

		const isMatched = await bcrypt.compare(password, user.password)

		if (!isMatched)
			return res.status(400).json({
				success: false,
				errors: [
					{
						value: password,
						msg: "Incorrect password",
						param: "password",
						location: "body",
					},
				],
			})

		const payload = { id: user.id }

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE,
		})

		res.status(201).json({
			success: true,
			token,
		})
	} catch (err) {
		console.error(err.message)

		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	}
}

// @desc	Register user
// @route   POST api/auth/register
// @access  Public
const register = async (req, res) => {
	const errors = validationResult(req)

	if (!errors.isEmpty())
		return res.status(400).json({
			success: false,
			errors: errors.array(),
		})

	try {
		const { name, email, password } = req.body

		const createdUser = await User.findOne({ email })

		if (createdUser)
			return res.status(400).json({
				success: false,
				errors: [
					{
						value: email,
						msg: "User already exists with the email",
						param: "email",
						location: "body",
					},
				],
			})

		const user = new User({ name, email, password })

		const salt = await bcrypt.genSalt(10)

		user.password = await bcrypt.hash(password, salt)

		await user.save()

		const payload = { id: user.id }

		const token = jwt.sign(payload, process.env.JWT_SECRET, {
			expiresIn: process.env.JWT_EXPIRE,
		})

		res.status(201).json({
			success: true,
			token,
		})
	} catch (err) {
		console.error(err.message)

		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	}
}

module.exports = { getAuthUser, login, register }