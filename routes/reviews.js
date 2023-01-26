const express = require("express")
const { check } = require("express-validator")

// middlewares
const auth = require("../middlewares/auth")

// controllers
const {
	getReviews,
	createReview,
	updateReview,
} = require("../controllers/reviews")

const router = express.Router({ mergeParams: true })

router
	.route("/")
	.get(getReviews)
	.post(
		[
			auth,
			check("name")
				.notEmpty()
				.withMessage("Review title is required")
				.isLength({ max: 50 })
				.withMessage("Review title can not be more than 50 characters"),
			check("text")
				.notEmpty()
				.withMessage("Review text is required")
				.isLength({ max: 500 })
				.withMessage("Review text can not be more than 500 characters"),
			check("rating")
				.optional()
				.isFloat({ min: 0, max: 5 })
				.withMessage("Rating must be a number between 0 and 5"),
		],
		createReview,
	)

router
	.route("/:reviewID")
	.put(
		[
			auth,
			check("title")
				.optional()
				.notEmpty()
				.withMessage("Review title is required")
				.isLength({ max: 50 })
				.withMessage("Review title can not be more than 50 characters"),
			check("text")
				.optional()
				.notEmpty()
				.withMessage("Review text is required")
				.isLength({ max: 500 })
				.withMessage("Review text can not be more than 500 characters"),
			check("rating")
				.optional()
				.isFloat({ min: 0, max: 5 })
				.withMessage("Rating must be a number between 0 and 5"),
		],
		updateReview,
	)

module.exports = router
