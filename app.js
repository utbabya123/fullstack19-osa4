const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const morgan = require('morgan')
const mongoose = require('mongoose')
const blogRouter = require('./controllers/blogs')
const userRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')
const middleware = require('./utils/middleware')

mongoose
  .connect(config.mongoUrl, { useNewUrlParser: true })
  .then(() => {
    console.log('connected to MongoDB')
  })
  .catch((error) => {
    console.log('error connection to MongoDB:', error.message)
  })

app.use(cors())
app.use(bodyParser.json())
app.use(middleware.tokenExtractor)

if (process.env.NODE_ENV !== 'test') {
  morgan.token('body', (req, res) => {
    return JSON.stringify(req.body)
  })
  
  app.use(morgan(':method :url :body :status :res[content-length] - :response-time ms'))
}

app.use('/api/blogs', blogRouter)
app.use('/api/users', userRouter)
app.use('/api/login', loginRouter)

module.exports = app