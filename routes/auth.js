const express = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const User = require("../models/User")

const auth = require("../middlewares/auth")

const router = express.Router()

// @route   GET api/auth
// @desc    Get auth user
// @access  Public
router.get("/", auth, async (req, res) => {
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
})

// @route   POST api/auth
// @desc    Login user
// @access  Public
router.post(
	"/",
	[
		check("email", "Please enter a valid email").isEmail(),
		check("password", "Please enter a password").exists(),
	],
	async (req, res) => {
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
)

module.exports = router
