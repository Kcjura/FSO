import { useState } from 'react'

const Blog = ({ blog, likeBlog, deleteBlog, user }) => {
  const [visible, setVisible] = useState(false)

  const blogStyle = {
    paddingTop: 10,
    paddingLeft: 2,
    border: 'solid',
    borderWidth: 1,
    marginBottom: 5
  }

  const toggleVisibility = () => {
    setVisible(!visible)
  }

  const showRemove =
    blog.user?.username === user?.username

  return (
    <div style={blogStyle} className="blog">
      <div className="blogSummary">
        {blog.title} {blog.author}{''}
       <button onClick={toggleVisibility}>
        {visible ? 'hide' : 'view'}
       </button>
      </div>

      {visible && (
        <div className="blogDetails">
          <div>{blog.url}</div>

          <div className="blogLikes">
            likes {blog.likes}{''}
            <button onClick={() => likeBlog(blog)}>like</button>
          </div>
  
          <div>{blog.user?.name}</div>

          {showRemove &&(
            <button onClick={() => deleteBlog(blog)}>remove</button>
          )}
    </div>
      )}
  </div>
  )
}

export default Blog