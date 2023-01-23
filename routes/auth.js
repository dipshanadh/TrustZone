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
			check("email", "Include a valid email").isEmail(),
			check("password", "Password is required").notEmpty(),
		],
		login,
	)
	.post(
		"/register",
		[
			check("name", "Name is required").notEmpty(),
			check("email", "Include a valid email").isEmail(),
			check(
				"password",
				"Enter a password with 6 or more characters",
			).isLength({ min: 6 }),
		],
		register,
	)

module.exports = router
