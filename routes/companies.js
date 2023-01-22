const express = require("express")

//middlewares
const auth = require("../middlewares/auth")

// controllers
const { getUserCompany } = require("../controllers/companies")

const router = express.Router({ mergeParams: true })

router.get("/", auth, getUserCompany)

module.exports = router
