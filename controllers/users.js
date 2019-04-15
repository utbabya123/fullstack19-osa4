const bcrypt = require('bcrypt')
const userRouter = require('express').Router()
const User = require('../models/user')

userRouter.get('/', async (request, response) => {
  const users = await User
    .find({})
    .populate('blogs', { title: 1, author: 1, url: 1, likes: 1 })
  response.json(users)
})

userRouter.post('/', async (request, response) => {
  try {
    const body = request.body

    if (body.username === undefined || body.password === undefined) {
      return response.status(400).json({ error: 'username and password are required' })
    }

    const existingUser = await User.find({ username: body.username })

    if (existingUser.length) {
      return response.status(400).json({ error: 'username must be unique' })
    }

    if (body.password.length < 3) {
      return response.status(400).json({ error: 'password must be atleast 3 characters' })
    }

    const saltRounds = 10
    const passwordHash = await bcrypt.hash(body.password, saltRounds)

    const user = new User({
      username: body.username,
      name: body.name,
      passwordHash
    })

    const savedUser = await user.save()

    response.json(savedUser)
  } catch (err) {
    console.log(err)
    response.status(500).json({ error: 'something went wrong' })
  }
})

module.exports = userRouter