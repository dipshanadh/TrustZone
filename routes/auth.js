const express = require("express")
const { check } = require("express-validator")

// middlewares
const auth = require("../middlewares/auth")

// controllers
const { getAuthUser, login, register } = require("../controllers/auth")

const router = express.Router()

router
	.get("/", auth, getAuthUser)
	.post(
		"/login",
		[
			check("email", "Please enter a valid email").isEmail(),
			check("password", "Please enter a password").exists(),
		],
		login
	)
	.post(
		"/register",
		[
			check("name", "Name is required").not().isEmpty(),
			check("email", "Please include a valid email").isEmail(),
			check(
				"password",
				"Please enter a password with 6 or more passwords"
			).isLength({ min: 6 }),
		],
		register
	)

module.exports = router
