const blogRouter = require('express').Router()
const Blog = require('../models/blog')
const User = require('../models/user')
const jwt = require('jsonwebtoken')

blogRouter.get('/', async (request, response) => {
  try {
    const blogs = await Blog
      .find({})
      .populate('user', { username: 1, name: 1 })
    response.json(blogs)
  } catch (err) {
    console.log(err)
  }
})

blogRouter.get('/:id', async (request, response) => {
  try {
    const blog = await Blog
      .findById(request.params.id)
      .populate('user', { username: 1, name: 1 })
    if (blog) {
      response.json(blog)
    } else {
      response.status(404).end()
    }
  } catch (err) {
    console.log(err)
    response.status(400).send({ error: 'malformatted id' })
  }
})

blogRouter.put('/:id', async (request, response) => {
  try {
    const body = request.body

    const blog = {
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes
    }

    const updatedBlog = await Blog.findOneAndUpdate(request.params.id, blog, { new: true })
    
    response.json(updatedBlog)
  } catch (err) {
    console.log(err)
    response.status(500).send({ error: 'something went wrong' })
  }
})

blogRouter.post('/', async (request, response) => {
  try {
    const body = request.body
    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid '})
    }
 
    const user = await User.findById(decodedToken.id)

    if (body.title === undefined || body.title === '' || body.url === undefined || body.url === '') {
      return response.status(400).json({ error: 'title or url missing' })
    }

    const blog = new Blog({
      title: body.title,
      author: body.author,
      url: body.url,
      likes: body.likes || 0,
      user: user._id
    })

    const savedBlog = await blog.save()
    user.blogs = user.blogs.concat(savedBlog._id)
    await user.save()
    
    response.status(201).json(savedBlog)
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      response.status(401).json({ error: err.message })
    } else {
      console.log(err)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

blogRouter.delete('/:id', async (request, response) => {
  try {
    const token = request.token

    const decodedToken = jwt.verify(token, process.env.SECRET)
    if (!token || !decodedToken.id) {
      return response.status(401).json({ error: 'token missing or invalid '})
    }

    const blog = await Blog.findById(request.params.id)
    
    if (!(blog.user.toString() === decodedToken.id.toString())) {
      return response.status(401).json({ error: 'no permission to delete' })
    }

    await Blog.findByIdAndRemove(request.params.id)
    response.status(204).end()
  } catch (err) {
    if (err.name === 'JsonWebTokenError') {
      response.status(401).json({ error: err.message })
    } else {
      console.log(err)
      response.status(500).json({ error: 'something went wrong' })
    }
  }
})

module.exports = blogRouter