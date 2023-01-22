const jwt = require("jsonwebtoken")

const { sendResponse } = require("../utils/sendResponse")

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
		sendResponse(res, false, 401, {
			msg: "Token is not valid",
		})
	}
}
