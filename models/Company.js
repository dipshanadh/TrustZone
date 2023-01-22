const mongoose = require("mongoose")

const CompanySchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "user",
	},
	name: {
		type: String,
		required: true,
		maxlength: 50,
	},
	description: {
		type: String,
		required: true,
		maxlength: 500,
	},
	website: {
		type: String,
		required: true,
	},
	location: {
		type: Sring,
		required: true,
	},
	email: {
		type: String,
		required: true,
	},
	phone: {
		type: String,
		required: true,
		maxlength: 20,
	},
	averageRating: {
		type: Number,
		min: 1,
		max: 5,
	},
	photo: {
		type: String,
		default: "no-photo.jpg",
	},
	createdAt: {
		type: Date,
		default: Date.now,
	},
})

module.exports = mongoose.model("Company", CompanySchema)
