const express = require("express")

// middlewares
const auth = require("../middlewares/auth")

// controllers
const { getReviews, createReview } = require("../controllers/reviews")
const { check } = require("express-validator")

const router = express.Router({ mergeParams: true })

router
	.route("/")
	.get(getReviews)
	.post(
		[
			auth,
			check(
				"title",
				"Review title can not be more than 50 characters",
			).isLength({ max: 50 }),
			check(
				"description",
				"Company description can not be more than 500 characters",
			).isLength({ max: 500 }),
			check("rating")
				.optional()
				.isFloat({ min: 0, max: 5 })
				.withMessage("Rating must be a number between 0 and 5"),
		],
		createReview,
	)

module.exports = router
