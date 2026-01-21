const config = require('./utils/config')
const mongoose = require('mongoose')
const Blog = require('./models/blog')
const app = require('./app')

const mongoUrl = process.env.MONGODB_URI
mongoose
    .connect(mongoUrl)
    .then(() => console.log('connected to MongoDB'))
    .catch((error) => console.log('error connecting to MongoDB:', error.message))

app.listen(config.PORT, () => {
    console.log(`Server is running on port ${config.PORT}`)
})

