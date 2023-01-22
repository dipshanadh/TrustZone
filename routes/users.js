const express = require("express")

// controllers
const { getUser } = require("../controllers/users")

const router = express.Router()

// Re-route into "/companies"
router.use("/:id/company", require("./companies"))

router.get("/:id", getUser)

module.exports = router
