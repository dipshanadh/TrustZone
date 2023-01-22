const jwt = require("jsonwebtoken")

const User = require("../models/User")

module.exports = async (req, res, next) => {
	let token

	if (
		req.headers.authorization &&
		req.headers.authorization.startsWith("Bearer")
	) {
		token = req.headers.authorization.split(" ")[1]
	}

	if (!token)
		return res.status(401).json({
			success: false,
			errors: [
				{
					msg: "Not authorized to access this route",
				},
			],
		})

	try {
		const decodedToken = jwt.verify(token, process.env.JWT_SECRET)

		req.user = { id: decodedToken.id }

		next()
	} catch (err) {
		res.status(401).json({
			success: false,
			errors: [
				{
					msg: "Token is not valid",
				},
			],
		})
	}
}
