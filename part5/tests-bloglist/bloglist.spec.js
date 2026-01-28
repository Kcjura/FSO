const { test, expect, beforeEach, describe } = require('@playwright/test')
const { loginWith, createBlog } = require('./bloglist-helper')

describe('Bloglist', () => {
  beforeEach(async ({ page, request }) => {
    await request.post('/api/testing/reset')
    await request.post('/api/users', {
      data: {
        username: 'markoboy',
        name: 'Testaaja Marko',
        password: 'salainen'
      },
    })

    await request.post('/api/users', {
      data: {
        username: 'djpate',
        name: 'Testaaja Pate',
        password: 'salainen'
      },
    })

    await page.goto('/')
  })

  test('Login form is shown', async ({ page }) => {
    const loginForm = page.getByText('log in to application')
    await expect(loginForm).toBeVisible()
  })

  describe('Login', () => {
    test('succeeds with correct credentials', async ({ page }) => {
    await loginWith(page, 'markoboy', 'salainen')
    await expect(page.getByText('Testaaja Marko logged in')).toBeVisible()
    })

    test('fails with wrong credentials', async ({ page }) => {
      await loginWith(page, 'markoboy', 'wrong')
      await expect(page.getByText('wrong username or password')).toBeVisible()
    })
  })

  describe('When logged in', () => {
    beforeEach(async ({ page }) => {
      await loginWith(page, 'markoboy', 'salainen')
      await expect(page.getByText('Testaaja Marko logged in')).toBeVisible()
    })

    test('a new blog can be created', async ({ page }) => {
      await createBlog(page, 'Testiblogi', 'Meikäpoika', 'www.suomi24.fi')
      await expect(page.getByText('a new blog')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('www.suomi24.fi')).toBeVisible()
      await expect(page.getByText('remove')).toBeVisible()
    })

    test('a blog can be liked', async ({ page }) => {
      await createBlog(page, 'Testiblogi', 'Meikäpoika', 'www.suomi24.fi')
      await expect(page.getByText('a new blog')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await expect(page.getByText('www.suomi24.fi')).toBeVisible()

      await page.getByRole('button', { name: 'logout' }).click()

      await loginWith(page, 'djpate', 'salainen')

      await expect(page.getByText('Testaaja Pate logged in')).toBeVisible()
      await page.getByRole('button', { name: 'view' }).click()
      await page.getByRole('button', { name: 'like' }).click()
      await expect(page.getByText('likes 1')).toBeVisible()
      await expect(page.getByText('remove')).not.toBeVisible()
    })

    test('arranging blogs by likes', async ({ page })=> {
      await createBlog(page, 'Ekablogi', 'Meikäpoika', 'www.suomi24.fi')
      await createBlog(page, 'Tokablogi', 'Meikäpoika', 'www.suomi24.fi')
      await createBlog(page, 'Kolmasblogi', 'Meikäpoika', 'www.suomi24.fi')

      await page.getByRole('button', { name: 'logout' }).click()
      await loginWith(page, 'djpate', 'salainen')
      await expect(page.getByText('Tokablogi')).toBeVisible()

      const otherBlogTitle = page.getByText('Tokablogi')
      const otherBlogElement = otherBlogTitle.locator('..')

      await otherBlogElement.getByRole('button', { name: 'view'}).click()
      await otherBlogElement.getByRole('button', { name: 'like'}).click()
      await expect(otherBlogElement.getByText('likes 1')).toBeVisible()

      const blogs = page.locator('.blog')
      await expect(blogs.first()).toContainText('Tokablogi')
    })
  })
})