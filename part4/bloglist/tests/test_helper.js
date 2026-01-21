const Blog = require('../models/blog')
const User = require('../models/user')

const initialBlogs = [
    {
        title: 'Lahtava homma',
        author: 'Matti',
        url: 'www.google.com',
        likes: 10,
    },
    {
        title: 'Mahtava homma',
        author: 'Matti',
        url: 'www.google.com',
    },
]

const blogsInDb = async () => {
    const blogs = await Blog.find({})
    return blogs.map(blog => blog.toJSON())
}

const usersInDb = async () => {
    const users = await User.find({})
    return users.map(u => u.toJSON())
}

module.exports = {
    initialBlogs,
    blogsInDb,
    usersInDb
}