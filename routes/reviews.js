const express = require("express")

// controllers
const { getReviews } = require("../controllers/reviews")

const router = express.Router({ mergeParams: true })

router.route("/").get(getReviews)

module.exports = router
