const blogsRouter = require('express').Router()
const middleware = require('../utils/middleware')
const Blog = require('../models/blog')

blogsRouter.get('/', async (request, response) => {
   const blogs = await Blog
     .find({})
     .populate('user', { username: 1, name: 1 })
   response.status(200).json(blogs.map(b => b.toJSON()))
})

blogsRouter.get('/:id', async (request, response) => {
  const blog = await Blog.findById(request.params.id)
  if (blog) {
    response.json(blog)
  } else {
    response.status(404).end()
  }
})

blogsRouter.post('/', middleware.userExtractor,  async (request, response) => {
  const body = request.body
  const user = request.user

  if (!body.title || !body.url) {
    return response.status(400).json({ error: 'title or url is missing' })
  }

  const blog = new Blog({
    title: body.title,
    author: body.author,
    url: body.url,
    likes: body.likes ?? 0,
    user: user._id,
  })

  const savedBlog = await blog.save()

  user.blogs = user.blogs.concat(savedBlog._id)
  await user.save()
  const populatedBlog = await savedBlog.populate('user', { username: 1, name: 1 })
  response.status(201).json(populatedBlog.toJSON())
})

blogsRouter.delete('/:id', middleware.userExtractor, async (request, response) => {
  const user = request.user
  
  const blog = await Blog.findById(request.params.id)
  if(!blog) {
    return response.status(404).end()
  }
  
  if(blog.user.toString() !== user._id.toString()) {
    return response.status(403).json({ error: 'only the creator can delete a blog post' })
  }
  
  await Blog.findByIdAndDelete(request.params.id)

  user.blogs = user.blogs.filter(b => b.toString() !== blog._id.toString())
  await user.save()

  response.status(204).end()
})

blogsRouter.put('/:id', async  (request, response) => {
  const { title, author, url, likes, user } = request.body

  const updated = await Blog.findByIdAndUpdate(
    request.params.id,
    { title, author, url, likes, user },
    { new: true })

  .populate('user', { username: 1, name: 1 })
  
  if (!updated) return response.status(404).end()

  response.json(updated.toJSON())
})

module.exports = blogsRouter