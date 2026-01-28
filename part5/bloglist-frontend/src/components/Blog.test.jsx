import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import BlogFrom from './BlogForm'


describe('<Blog />', () => {
  let blog
  let user

  beforeEach(() => {
    blog = {
      title: 'Testaillaas',
      author: 'Marko',
      url: 'www.google.com',
      likes: 2000,
      user: {
        username: 'mark',
        name: 'Marko Boinen',
        id: 'user1'
      }
    }

    const user = { username: 'mark', name: 'Marko Boinen'}

    render(
      <Blog
        blog={blog}
        likeBlog={() => {}}
        deleteBlog={() => {}}
        user={user}
      />
    )
  })

  test('renders title and author, but not url or likes by default', () => {
    
    const content = screen.getByText('Testaillaas Marko')
    expect(content).toBeDefined()
    
    const link = screen.queryByText('www.google.com')
    expect(link).toBeNull()
    
    const likes = screen.queryByText('likes 2000')
    expect(likes).toBeNull()
  })

  test('shows url and likes after clicking view button', async () => {
    const userEventInstance = userEvent.setup()

    const button = screen.getByText('view')
    await userEventInstance.click(button)

    expect(screen.getByText('www.google.com')).toBeDefined()
    expect(screen.getByText('likes 2000')).toBeDefined()
  })
})

test('clicking like twice calls event handler twice', async () => {
  const blog = {
      title: 'Testaillaas',
      author: 'Marko',
      url: 'www.google.com',
      likes: 2000,
      user: {
        username: 'mark',
        name: 'Marko Boinen',
        id: 'user1'
      }
    }

    const user = { username: 'mark', name: 'Marko Boinen'}

    const mockHandler = vi.fn()

  render(
    <Blog
      blog={blog}
      likeBlog={mockHandler}
      deleteBlog={() => {}}
      user={user}
    />
  )

  const userEventInstance = userEvent.setup()
  const viewButton = screen.getByText('view')
  await userEventInstance.click(viewButton)

  expect(screen.getByText('www.google.com')).toBeDefined()
  expect(screen.getByText('likes 2000')).toBeDefined()

  const likeButton = screen.getByText('like')
  await userEventInstance.click(likeButton)
  await userEventInstance.click(likeButton)

  expect(mockHandler.mock.calls).toHaveLength(2)
 })

 test('<BlogForm /> updates parent state and calls onSubmit', async () => {
  const createBlog = vi.fn()
  const user = userEvent.setup()

  render(<BlogFrom createBlog={createBlog} />)

  const inputTitle = screen.getByPlaceholderText('write blog title here')
  const inputAuthor = screen.getByPlaceholderText('write blog author here')
  const inputUrl = screen.getByPlaceholderText('write blog url here')
  const submitButton = screen.getByText('create')

  await user.type(inputTitle, 'testing a blog...')
  await user.type(inputAuthor, 'Testaaja')
  await user.type(inputUrl, 'www.aapeli.fi')
  await user.click(submitButton)

  expect(createBlog.mock.calls).toHaveLength(1)
  expect(createBlog.mock.calls[0][0].title).toBe('testing a blog...')
  expect(createBlog.mock.calls[0][0].author).toBe('Testaaja')
  expect(createBlog.mock.calls[0][0].url).toBe('www.aapeli.fi')

  console.log(createBlog.mock.calls)
})