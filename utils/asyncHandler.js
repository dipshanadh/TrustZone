const asyncHandler = fn => (req, res) => {
	fn(req, res).catch(err => {
		console.error(err.message)

		res.status(500).json({
			success: false,
			errors: [
				{
					msg: "Something went wrong",
				},
			],
		})
	})
}

module.exports = asyncHandler
