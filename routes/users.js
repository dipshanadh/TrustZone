const express = require("express")
const { check, validationResult } = require("express-validator")
const bcrypt = require("bcryptjs")

const User = require("../models/User")

const router = express.Router()

// @route   POST api/users
// @desc	Register user
// @access  Public
router.post(
	"/",
	[
		check("name", "Name is required").not().isEmpty(),
		check("email", "Please include a valid email").isEmail(),
		check(
			"password",
			"Please enter a password with 6 or more passwords"
		).isLength({ min: 6 }),
	],
	async (req, res) => {
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

			res.status(201).json({
				success: true,
				data: user,
			})
		} catch (err) {
			console.error(err.message)

			res.status(500).json({
				success: false,
				errors: [
					{
						message: "Something went wrong",
					},
				],
			})
		}
	}
)

module.exports = router
