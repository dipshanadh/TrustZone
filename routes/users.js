const express = require("express")

const auth = require("../middlewares/auth")

// controllers
const { getUser, getUserCompany } = require("../controllers/users")

const router = express.Router()

router.get("/:id", getUser).get("/:id/company", auth, getUserCompany)

module.exports = router
