const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxlength: 50,
	},
	text: {
		type: String,
		required: true,
		maxlength: 500,
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
		default: 1,
	},
	likes: [
		{
			user: {
				type: mongoose.Schema.Types.ObjectId,
				ref: "users",
			},
		},
	],
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "users",
		required: true,
	},
	company: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "companies",
		required: true,
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model("Review", ReviewSchema)
