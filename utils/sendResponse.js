const sendResponse = (res, isSuccess, statusCode, data) => {
	if (isSuccess)
		res.status(statusCode).json({
			success: true,
			data,
		})
	else
		res.status(statusCode).json({
			success: false,
			errors: data,
		})
}

module.exports = { sendResponse }
