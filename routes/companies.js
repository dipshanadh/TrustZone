const express = require("express")
const { check } = require("express-validator")

//middlewares
const auth = require("../middlewares/auth")

// controllers
const {
	getCompany,
	getCompanies,
	createCompany,
	updateCompany,
} = require("../controllers/companies")

const router = express.Router()

router
	.route("/")
	.get(getCompanies)
	.post(
		[
			auth,
			check("name", "Company name is required").notEmpty(),
			check("description", "Company description is required").notEmpty(),
			check("email", "Enter a valid email").isEmail(),
			check("phone", "Enter a valid phone number").isMobilePhone(),
			check("website", "Enter a valid URL").isURL(),
			check("location", "Company location is required").notEmpty(),
		],
		createCompany
	)

router.route("/:id").get(getCompany).put(auth, updateCompany)

module.exports = router
