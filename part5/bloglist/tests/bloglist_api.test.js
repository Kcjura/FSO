const assert = require('node:assert')
const { test, after, before, beforeEach, describe } = require('node:test')
const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const bcrypt = require('bcrypt')
const config = require('../utils/config')
const helper = require('./test_helper')
const Blog = require('../models/blog')
const User = require('../models/user')

before(async () => {
  await mongoose.connect(config.MONGODB_URI, { family: 4 })
})

const api = supertest(app)

beforeEach(async () => {
    await User.deleteMany({})
    await Blog.deleteMany({})
    
    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', name: 'Root User', passwordHash})
    userInDb = await user.save()

    const loginResponse = await api
      .post('/api/login')
      .send({ username: 'root', password: 'sekret' })
      .expect(200)

      token = loginResponse.body.token

      const blogsWithUser = helper.initialBlogs.map(b => ({
        ...b,
        user: userInDb._id,
      }))

      const savedBlogs = await Blog.insertMany(blogsWithUser)

      userInDb.blogs = savedBlogs.map(b => b._id)
      await userInDb.save()
})

test('blogs are returned as json', async () => {
    await api
      .get('/api/blogs')
      .expect(200)
      .expect('Content-Type', /application\/json/)
})

test('all blogs are returned', async () => {
    const response = await api.get('/api/blogs')

    assert.strictEqual(response.body.length, helper.initialBlogs.length)
    console.log(response)
})

test('the unique indentifier property of blog posts is id', async () => {
    const response = await api.get('/api/blogs')

    const blog = response.body[0]

    assert(blog.id)
    assert.strictEqual(blog._id, undefined)
})

test('a valid blog post can be added ', async () => {
  const newBlog = {
    title: 'Jere is my new blog',
    author: 'Raimo',
    url: 'www.reddit.com',
    likes: 2
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(newBlog)
    .expect(201)
    .expect('Content-Type', /application\/json/)

  const blogsAtEnd = await helper.blogsInDb()
  assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)

  const titles = blogsAtEnd.map(b => b.title)
  assert(titles.includes('Jere is my new blog'))
})

test('blog without likes property defaults likes to 0', async () => {
    const newBlog = {
        title: "Ei tykkäyksiä",
        author: "Meikäpoika",
        url: "tasory.tamk.fi"
    }

    await api
      .post('/api/blogs')
      .set('Authorization', `Bearer ${token}`)
      .send(newBlog)
      .expect(201)
    
    const blogsAtEnd = await helper.blogsInDb()

    const likesAmount = blogsAtEnd.map(b => b.likes)
    assert(likesAmount.includes(0))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length + 1)
})

test('blog without title or url leads to response 400', async () => {
  const blogWithoutUrl = {
      title: "Ei osoitetta",
      author: "Teikäpoika",
      likes: 200,
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutUrl)
    .expect(400)
  
  console.log('first test succeeded')

  const blogWithoutTitle = {
    author: "Jokupoika",
    url: "metropolia.com",
    likes: 1
  }

  await api
    .post('/api/blogs')
    .set('Authorization', `Bearer ${token}`)
    .send(blogWithoutTitle)
    .expect(400)

    const blogsAtEnd = await helper.blogsInDb()
    assert.strictEqual(blogsAtEnd.length , helper.initialBlogs.length)
})

test('succeeds with status code 204 if id is valid', async () => {
    const blogsAtStart = await helper.blogsInDb()
    const blogToDelete = blogsAtStart[0]

    await api
      .delete(`/api/blogs/${blogToDelete.id}`)
      .set('Authorization', `Bearer ${token}`)
      .expect(204)

    const blogsAtEnd = await helper.blogsInDb()

    const ids = blogsAtEnd.map(b => b.id)
    assert(!ids.includes(blogToDelete.id))

    assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length - 1)
 })


test('updating number of likes on a blog post', async () => {
  const blogsAtStart = await helper.blogsInDb()
  const blogToUpdate = blogsAtStart[0]

  const updatedData = {
    title: blogToUpdate.title,
    author: blogToUpdate.author,
    url: blogToUpdate.url,
    likes: blogToUpdate.likes + 1,
  }

  const response = await api
  .put(`/api/blogs/${blogToUpdate.id}`)
  .send(updatedData)
  .expect(200)
  .expect('Content-Type', /application\/json/)

  assert.strictEqual(response.body.likes, blogToUpdate.likes + 1)

  const blogsAtEnd = await helper.blogsInDb()
  const updatedBlog = blogsAtEnd.find(b => b.id === blogToUpdate.id)

  assert.strictEqual(updatedBlog.likes, blogToUpdate.likes + 1)

})

describe('when there is initially one user in db', () => {
  beforeEach(async () => {
    await User.deleteMany({})

    const passwordHash = await bcrypt.hash('sekret', 10)
    const user = new User({ username: 'root', passwordHash })

    await user.save()
  })

  test('creation succeeds with a fresh username', async () => {
    const usersAtStart = await helper.usersInDb()

    const newUser = {
      username: 'Markoboi',
      name: 'Marko Boinen',
      password: 'salainen',
    }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(201)
      .expect('Content-Type', /application\/json/)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length + 1)

    const usernames = usersAtEnd.map(u => u.username)
    assert(usernames.includes(newUser.username))
  })
})

describe('invalid users are not created', async () => {
  test('creation denied with invalid username', async () => {
    const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'Ma',
        name: 'Marko Boinen',
        password: 'salainen',
      }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
    })

    test('creation denied with invalid password', async () => {
      const usersAtStart = await helper.usersInDb()

      const newUser = {
        username: 'markoboi',
        name: 'Marko Boinen',
        password: 'sa',
      }

    await api
      .post('/api/users')
      .send(newUser)
      .expect(400)

    const usersAtEnd = await helper.usersInDb()
    assert.strictEqual(usersAtEnd.length, usersAtStart.length)
  })
})

describe('tests with tokens', async () => {
  test('adding a blog fails with 401 if token is not provided', async () => {
    const newBlog = {
      title: 'No token blog',
      author: 'Marko',
      url: 'aapeli.fi',
      likes: 1
    }

    await api
      .post('/api/blogs')
      .send(newBlog)
      .expect(401)

      const blogsAtEnd = await helper.blogsInDb()
      assert.strictEqual(blogsAtEnd.length, helper.initialBlogs.length)
  })
})

after(async () =>  {
    await mongoose.connection.close()
})