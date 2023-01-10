const express = require('express'),
	dotenv = require('dotenv')

const connectDB = require('./config/db')

dotenv.config({ path: './config/config.env' })

const app = express()

// Connect to database
connectDB()

app.get('/', (req, res) => {
	res.send('API running')
})

const PORT = process.env.PORT

app.listen(PORT, () => `Server running on PORT ${PORT}`)
