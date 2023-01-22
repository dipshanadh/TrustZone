const jwt = require("jsonwebtoken")

const sendResponse = (res, isSuccess, statusCode, data) =>
	res.status(statusCode).json({
		success: isSuccess,
		[isSuccess ? "data" : "errors"]: data,
	})

const sendToken = (res, payload) => {
	const token = jwt.sign(payload, process.env.JWT_SECRET, {
		expiresIn: process.env.JWT_EXPIRE,
	})

	res.status(201).json({
		success: true,
		token,
	})
}

module.exports = { sendResponse, sendToken }
