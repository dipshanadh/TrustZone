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
	deleteCompany,
} = require("../controllers/companies")

// Other routers
const reviewRouter = require("./reviews")

const router = express.Router()

router
	.route("/")
	.get(getCompanies)
	.post(
		[
			auth,
			check("name")
				.notEmpty()
				.withMessage("Company name is required")
				.isLength({ max: 50 })
				.withMessage("Company name can not be more than 50 characters"),
			check("description")
				.notEmpty()
				.withMessage("Company description is required")
				.isLength({ max: 500 })
				.withMessage(
					"Company description can not be more than 500 characters",
				),
			check("email", "Enter a valid email").isEmail(),
			check("phone")
				.isMobilePhone()
				.withMessage("Enter a valid phone number")
				.isLength({ max: 15 })
				.withMessage("Phone no. length can not be more than 15"),
			check("website", "Enter a valid URL").isURL(),
			check("location", "Company location is required").notEmpty(),
		],
		createCompany,
	)

router
	.route("/:id")
	.get(getCompany)
	.put(
		[
			auth,
			check(
				"name",
				"Company name can not be more than 50 characters",
			).isLength({ max: 50 }),
			check(
				"description",
				"Company description can not be more than 500 characters",
			).isLength({ max: 500 }),
			check("email")
				.if(value => (value.length > 0 ? true : false))
				.isEmail()
				.withMessage("Enter a valid email"),
			check("phone")
				.if(value => (value.length > 0 ? true : false))
				.isMobilePhone("ne-NP")
				.withMessage("Enter a valid phone number"),
			check("website")
				.if(value => (value.length > 0 ? true : false))
				.isURL()
				.withMessage("Enter a valid URL"),
		],
		updateCompany,
	)
	.delete(auth, deleteCompany)

router.use("/:id/reviews", reviewRouter)

module.exports = router
