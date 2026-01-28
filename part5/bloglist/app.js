const express = require('express')
const blogsRouter = require('./controllers/blogs.js')
const loginRouter = require('./controllers/login.js')
const middleware = require('./utils/middleware.js')
const usersRouter = require('./controllers/users.js')
const app = express()

const Blog = require('./models/blog')

app.use(express.json())
app.use(middleware.tokenExtractor)

app.use('/api/blogs', blogsRouter)
app.use('/api/login', loginRouter)
app.use('/api/users', usersRouter)

if (process.env.NODE_ENV === 'test') {
  const testingRouter = require('./controllers/testing')
  app.use('/api/testing', testingRouter)
}

module.exports = app 