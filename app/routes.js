const express = require('express');
const router = express.Router();
const mainController   = require('./controllers/main.controller');
const blogsController = require('./controllers/blogs.controller');

module.exports = router;

router.get('/',                 mainController.showHome);
router.get('/blogs',            blogsController.showBlogs);
router.get('/blogs/seed',       blogsController.seedBlog);
router.get('/blogs/create',     blogsController.showCreate);
router.post('/blogs/create',    blogsController.processCreate);
router.get('/blogs/:slug',      blogsController.showSingle);
router.get('/blogs/:slug/edit', blogsController.showEdit);
router.post('/blogs/:slug',     blogsController.processEdit);
router.get('/blogs/:slug/delete', blogsController.deleteBlog);
