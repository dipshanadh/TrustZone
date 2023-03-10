const express = require("express"),
	dotenv = require("dotenv")

const connectDB = require("./config/db")

dotenv.config({ path: "./config/config.env" })

// Connect to database
connectDB()

// Middleware files
const logger = require("./middlewares/logger")

// Router files
const users = require("./routes/users"),
	auth = require("./routes/auth"),
	companies = require("./routes/companies"),
	reviews = require("./routes/reviews")

const app = express()

// Middlewares
app.use(logger)
app.use(express.json())

// Mount routes
app.use("/api/users", users)
app.use("/api/auth", auth)
app.use("/api/companies", companies)
app.use("/api/reviews", reviews)

app.get("*", (req, res) => {
	res.send("API running")
})

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`Server running on PORT ${PORT}`))
