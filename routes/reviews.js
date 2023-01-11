const express = require('express')

const router = express.Router()

// @route   api/reviews
// @desc    Test route
// @access  Public
router.get('/', (req, res) => {
	res.send('Reviews route')
})

module.exports = router
