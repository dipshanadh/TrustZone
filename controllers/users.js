const User = require("../models/User")

// @desc    Get a user
// @route   GET /api/user/:id
// @access  Public
const getUser = async (req, res) => {
	const id = req.params.id

	try {
		const user = await User.findById(id)

		if (!user)
			return res.status(500).json({
				success: false,
				errors: [
					{
						value: id,
						msg: "Could not find the user",
						param: "id",
						location: "params",
					},
				],
			})

		res.status(200).json({
			success: true,
			data: user,
		})
	} catch (err) {
		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	}
}

module.exports = { getUser }