const _ = require('lodash')

const dummy = (blogs) => {
  return 1
}

const totalLikes = (blogs) => {
  return blogs.reduce((total, blog) => total + blog.likes, 0)
}

const favoriteBlog = (blogs) => {
  if (!blogs.length) {
    return null
  }

  return _.maxBy(blogs, blog => blog.likes)
}

const mostBlogs = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const blogsPerAuthor = blogs.reduce((total, blog) => {
    total[blog.author] ? total[blog.author] += 1 : total[blog.author] = 1
    return total
  }, {})

  const blogsPerAuthorArray = Object.keys(blogsPerAuthor).map(author => ({
    author,
    blogs: blogsPerAuthor[author]
  }))

  return _.maxBy(blogsPerAuthorArray, e => e.blogs)
}

const mostLikes = (blogs) => {
  if (!blogs.length) {
    return null
  }

  const likesPerAuthor = blogs.reduce((total, blog) => {
    total[blog.author] ? total[blog.author] += blog.likes : total[blog.author] = blog.likes
    return total
  }, {})

  const likesPerAuthorArray = Object.keys(likesPerAuthor).map(author => ({
    author,
    likes: likesPerAuthor[author]
  }))

  return _.maxBy(likesPerAuthorArray, e => e.likes)
}

module.exports = {
  dummy,
  totalLikes,
  favoriteBlog,
  mostBlogs,
  mostLikes
}