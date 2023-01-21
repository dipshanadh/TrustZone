const express = require("express")
const { check, validationResult } = require("express-validator")

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
	(req, res) => {
		const errors = validationResult(req)

		if (errors.isEmpty()) {
			res.status(200).json({
				success: true,
			})
		} else {
			res.status(400).json({
				success: false,
				errors: errors.array(),
			})
		}
	}
)

module.exports = router
