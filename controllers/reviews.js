const Company = require("../models/Company")
const Reviews = require("../models/Reviews")

// utils
const asyncHandler = require("../utils/asyncHandler")
const checkValidationErrors = require("../utils/checkValidationErrors")
const { sendResponse } = require("../utils/sendResponse")

// @route	GET api/companies/:id/reviews
// @desc	Get reviews of a company
// @access	Public
const getReviews = asyncHandler(async (req, res) => {
	const company = await Company.findById(req.params.id)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const reviews = await Reviews.find({ company: req.params.id })

	sendResponse(res, true, 200, reviews)
})

// @route   POST api/companies/:id/reviews
// @desc    Create a review
// @access  Private
const createReview = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const companyID = req.params.id

	const company = await Company.findById(companyID)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const createdReview = await Reviews.findOne({
		user: req.user.id,
		company: companyID,
	})

	if (createdReview)
		return sendResponse(res, false, 400, [
			{ msg: "A user can't create more than one review for a company" },
		])

	const { title, text, rating } = req.body

	const review = await Reviews.create({
		title,
		text,
		rating,
		company: companyID,
		user: req.user.id,
	})

	sendResponse(res, true, 201, review)
})

// @route   PUT api/companies/:id/reviews/:reviewID
// @desc    Update a review
// @access  Private
const updateReview = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const companyID = req.params.id

	const company = await Company.findById(companyID)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const review = await Reviews.findOne({
		_id: req.params.reviewID,
		company: req.params.id,
	})

	if (!review)
		return sendResponse(res, false, 400, [
			{ msg: "Could not find the review" },
		])

	if (req.user.id !== review.user.toString())
		return sendResponse(res, false, 400, [
			{ msg: "The review doesn't belong to the current user" },
		])

	const { title, text, rating } = req.body

	if (title) review.title = title
	if (text) review.text = text
	if (rating) review.rating = rating

	await review.save()

	sendResponse(res, true, 200, review)
})

// @route   DELETE api/companies/:id/reviews/:reviewID
// @desc    Delete a company
// @access  Private
const deleteReview = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const companyID = req.params.id

	const company = await Company.findById(companyID)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const review = await Reviews.findOne({
		_id: req.params.reviewID,
		company: companyID,
	})

	if (!review)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the review" },
		])

	if (req.user.id !== review.user.toString())
		return sendResponse(res, false, 400, [
			{ msg: "The review doesn't belong to the current user" },
		])

	await review.delete()

	sendResponse(res, true, 201, {})
})

// @route   PUT api/companies/:id/reviews/:reviewID/like
// @desc    Like a review
// @access  Private
const likeReview = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const companyID = req.params.id

	const company = await Company.findById(companyID)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const review = await Reviews.findOne({
		_id: req.params.reviewID,
		company: companyID,
	})

	if (!review)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the review" },
		])

	if (
		review.likes.filter(like => like.user.toString() === req.user.id)
			.length > 0
	)
		return sendResponse(res, false, 400, [
			{ msg: "Review has already been liked" },
		])

	review.likes.unshift({ user: req.user.id })

	await review.save()

	sendResponse(res, true, 201, review.likes)
})

// @route   PUT api/companies/:id/reviews/:reviewID/unlike
// @desc    Unlike a review
// @access  Private
const unlikeReview = asyncHandler(async (req, res) => {
	if (checkValidationErrors(req, res)) return

	const companyID = req.params.id

	const company = await Company.findById(companyID)

	if (!company)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the company" },
		])

	const review = await Reviews.findOne({
		_id: req.params.reviewID,
		company: companyID,
	})

	if (!review)
		return sendResponse(res, false, 404, [
			{ msg: "Could not find the review" },
		])

	if (
		review.likes.filter(like => like.user.toString() === req.user.id)
			.length === 0
	)
		return sendResponse(res, false, 400, [
			{ msg: "Review has not yet been liked" },
		])

	const removeIndex = review.likes
		.map(likes => likes.user.toString())
		.indexOf(req.user.id)

	review.likes.splice(removeIndex, 1)

	await review.save()

	sendResponse(res, true, 201, review.likes)
})

module.exports = {
	getReviews,
	createReview,
	updateReview,
	deleteReview,
	likeReview,
	unlikeReview,
}
