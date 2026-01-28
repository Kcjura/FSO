import { useState, useEffect, useRef } from 'react'
import Blog from './components/Blog'
import BlogForm from './components/BlogForm'
import Notification from './components/Notification'
import LoginForm from './components/LoginForm'
import Togglable from './components/Togglable'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
  const [blogs, setBlogs] = useState([])

  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [user, setUser] = useState(null)

  const [notification, setNotification] = useState(null)

  const blogFormRef = useRef()

  useEffect(() => {
    if (user) {
    blogService.getAll().then(blogs => setBlogs(blogs))
    } else {
      setBlogs([])
    }
  }, [user])

  useEffect(() => {
    const loggedUserJSON = window.localStorage.getItem('loggedBloglistUser')
    if (loggedUserJSON) {
      const user = JSON.parse(loggedUserJSON)
      setUser(user)
      blogService.setToken(user.token)
    }
  }, [])

  const handleLogin = async event => {
    event.preventDefault()
  
    try {
      const user = await loginService.login({ username, password })
      window.localStorage.setItem(
        'loggedBloglistUser', JSON.stringify(user)
      )
      blogService.setToken(user.token)
      setUser(user)
      setUsername('')
      setPassword('')
    } catch (error) {
      showNotification('wrong username or password', 'error')
    }
  }

  const handleLogout = () => {
    window.localStorage.removeItem('loggedBloglistUser')
    blogService.setToken(null)
    setUser(null)
    setBlogs([])
  }

  const showNotification = (message, type = 'success') => {
    setNotification({ message, type })
    setTimeout(() => {
      setNotification(null)
    }, 5000)
  }

  const createBlog = async (blogObject) => {
    try {
      const newBlog = await blogService.create(blogObject)
    
      blogFormRef.current.toggleVisibility()
      setBlogs(prev => prev.concat(newBlog))
      showNotification(`a new blog ${newBlog.title} by ${newBlog.author} added`, 'success')
    } catch (error) {
      showNotification('failed to create blog', 'error')
    }
  }

  const loginForm = () => (
    <Togglable buttonLabel="login">
      <LoginForm
        username={username}
        password={password}
        handleUsernameChange={({ target }) => setUsername(target.value)}
        handlePasswordChange={({ target }) => setPassword(target.value)}
        handleSubmit={handleLogin}
      />
    </Togglable>
  )

   const blogForm = () => (
    <Togglable buttonLabel="new blog" ref={blogFormRef}>
      <BlogForm createBlog={createBlog} />
    </Togglable>
  )

  const likeBlog = async (blog) => {
    const updatedPayload = {
      ...blog,
      likes: blog.likes + 1,
      user: blog.user.id
    }
    const returnedBlog = await blogService.update(blog.id, updatedPayload)

    setBlogs(prev => prev.map(b => (b.id === returnedBlog. id ? returnedBlog : b)))

  }

  const deleteBlog = async (blog) => {
    const ok = window.confirm(
      `Remove blog ${blog.title} by ${blog.author}`
    )
    if (!ok) return

    try {
      await blogService.remove(blog.id)
      setBlogs(prev => prev.filter(b => b.id !== blog.id))
      showNotification(`blog ${blog.title} removed`, 'successs')
    } catch (error) {
      showNotification('failed to remove blog', 'error')
    }
  }

  if (!user) {
    return (
      <div>
        <Notification message={notification?.message} type={notification?.type} />
        <h2>log in to application</h2>
        {loginForm()}
      </div>
    )
  }

  const sortedBlogs = [...blogs].sort((a,b) => b.likes - a.likes)

  return (
    <div>
      <Notification message={notification?.message} type={notification?.type} />
      <h2>blogs</h2>

      <div>
        {user.name} logged in
        <button onClick={handleLogout}>logout</button>
      </div>

      {blogForm()}

      {sortedBlogs.map(blog =>
        <Blog key={blog.id} blog={blog} likeBlog={likeBlog} deleteBlog={deleteBlog} user={user} />
      )}
    </div>
  )
}

export default App