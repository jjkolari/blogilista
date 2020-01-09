const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = (sum, blog) => {
        return sum + blog.likes
    }

    return blogs.reduce(likes, 0)
}

const favouriteBlog = (blogs) => {
    const indexOfMaxBlog = blogs.reduce((iMax, x, i, blog) => x.likes > blog[iMax].likes ? i : iMax, 0)
    return blogs[indexOfMaxBlog]
}

module.exports = {
    dummy, totalLikes, favouriteBlog
}