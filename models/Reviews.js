const mongoose = require("mongoose")

const ReviewSchema = new mongoose.Schema({
	title: {
		type: String,
		required: true,
		maxlength: 50,
	},
})

module.exports = mongoose.model(ReviewSchema)
