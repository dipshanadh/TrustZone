const express = require('express'),
	dotenv = require('dotenv')

dotenv.config({ path: './config.env' })

const app = express()

app.get('/', (req, res) => {
	res.send('API running')
})

const PORT = process.env.PORT

app.listen(PORT, () => `Server running on PORT ${PORT}`)
