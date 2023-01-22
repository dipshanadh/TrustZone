const User = require("../models/User")

// utils
const asyncHandler = require("../utils/asyncHandler")
const { sendResponse } = require("../utils/sendResponse")

// @desc    Get a user
// @route   GET /api/user/:id
// @access  Public
const getUser = asyncHandler(async (req, res) => {
	const id = req.params.id

	const user = await User.findById(id)

	if (!user)
		return sendResponse(res, false, 500, [
			{
				value: id,
				msg: "Could not find the user",
				param: "id",
				location: "params",
			},
		])

	sendResponse(res, true, 200, user)
})

module.exports = { getUser }
