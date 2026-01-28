import { useState } from 'react'

const BlogForm = ({ createBlog }) => {
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [url, setUrl] = useState('')

  const addBlog = (event) => {
    event.preventDefault()
    createBlog({ title, author, url })
    setTitle('')
    setAuthor('')
    setUrl('')
  }

  return (
    <form onSubmit={addBlog}>
      <div>
        <label>
        title 
        <input 
          value={title} 
          onChange={({ target }) => setTitle(target.value)} 
          placeholder='write blog title here'
        />
        </label>
      </div>
      <div>
        <label>
        author 
          <input value={author} 
          onChange={({ target }) => setAuthor(target.value)} 
          placeholder='write blog author here'
        />
        </label>
      </div>
      <div>
        <label>
        url 
        <input value={url} 
        onChange={({ target }) => setUrl(target.value)} 
        placeholder='write blog url here'
      />
      </label>
      </div>
      <button type="submit">create</button>
    </form>
  )
}

export default BlogForm
