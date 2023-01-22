const express = require("express")

const router = express.Router()

const auth = require("../middlewares/auth")
const User = require("../models/User")

// @route   api/auth
// @desc    Test route
// @access  Public
router.get("/", auth, async (req, res) => {
	try {
		const user = await User.findById(req.user.id).select("-password")

		res.status(200).json({
			success: true,
			data: user,
		})
	} catch (err) {
		console.error(err.message)

		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	}
})

module.exports = router
