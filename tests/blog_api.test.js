const mongoose = require('mongoose')
const supertest = require('supertest')
const helper = require('./test_helper')
const app = require('../app')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    let blogObject = new Blog(helper.initialBlogs[0])
    await blogObject.save()

    blogObject = new Blog(helper.initialBlogs[1])
    await blogObject.save()
})

test('right amount of blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)


    expect(response.body.length).toBe(helper.initialBlogs.length)
})

test('blog has an id', async () => {
    const response = await api
        .get('/api/blogs')

    response.body.map(b => {
        expect(b.id).toBeDefined()
    })
})

test('a valid blog can be added ', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html",
        likes: 12
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)


    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd.length).toBe(helper.initialBlogs.length + 1)

    const titles = blogsAtEnd.map(b => b.title)
    expect(titles).toContain(
        'Canonical string reduction'
    )
})

test('a blog without given like has 0 likes', async () => {
    const newBlog = {
        title: "Canonical string reduction",
        author: "Edsger W. Dijkstra",
        url: "http://www.cs.utexas.edu/~EWD/transcriptions/EWD08xx/EWD808.html"
    }

    const BlogWithoutALike = await api
        .post('/api/blogs')
        .send(newBlog)

    expect(BlogWithoutALike.body.likes).toBe(0)
})

test('a blog without given title and url fails', async () => {
    const newBlog = {
        author: "Edsger W. Dijkstra",
        likes: 4
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)

})

afterAll(() => {
    mongoose.connection.close(true)
})