const mongoose = require('mongoose')

const connectDB = async () => {
	try {
		mongoose.set('strictQuery', false)

		const conn = await mongoose.connect(process.env.MONGO_URI)

		console.log(`MongoDB connected: ${conn.connection.host}`)
	} catch (err) {
		console.log(`Could not connect to database: ${err.message}`)

		process.exit(1)
	}
}

module.exports = connectDB
