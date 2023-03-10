const { sendResponse } = require("./sendResponse")

const asyncHandler = fn => (req, res) => {
	fn(req, res).catch(err => {
		console.error(err.stack)

		sendResponse(res, false, 500, [
			{
				msg: "Something went wrong",
			},
		])
	})
}

module.exports = asyncHandler
