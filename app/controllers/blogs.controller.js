const Blog = require('../models/Blog');

module.exports = {
    showBlogs:      showBlogs,
    showSingle:     showSingle,
    seedBlog:       seedBlog,
    showCreate:     showCreate,
    processCreate:  processCreate,
    showEdit:       showEdit,
    processEdit:    processEdit,
    deleteBlog:     deleteBlog
}
// show all blogs
function showBlogs(req, res) {
    Blog.find({}, (err, blogs) => {
        if(err) {
            res.status(404);
            res.send('Blogs not found')
        }
        res.render('pages/blogs', { 
            blogs: blogs,
            success: req.flash('success')
        });
    })
}

// seed the database
function seedBlog(req, res) {
    const blogs = [
        {name: 'canan', lastname: 'engin', title: 'yeni baslik canan', description: 'first blog post', date: Date.now()}
    ];
    for (blog of blogs) {
        var newBlog = new Blog(blog);
        newBlog.save();
    }
    res.send('Database seeded');
}

function showCreate (req, res) {
    res.render('pages/create', {
        errors: req.flash('errors')
      });
}

function processCreate (req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('lastname', 'Lastname is required.').notEmpty();
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    // if there are errors redirect and save errors to flash
    const errors = req.validationErrors()
    if(errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect('/blogs/create');
    }
    // create a new blog
    const blog = new Blog({
        name: req.body.name,
        lastname: req.body.lastname,
        title: req.body.title,
        description: req.body.description,
        date: Date.now()
    });
    // save blog
    blog.save((err) => {
        if(err) {
            res.send(err);
        }
        // set a succussful flash message
        req.flash('success', 'Blog created successduly.');
        //redirect to newly created blog
        res.redirect(`/blogs/${blog.slug}`)
    });
}

//show edit page
function showEdit (req, res) {
    Blog.findOne({ slug: req.params.slug }, (err, blog) => {
        res.render('pages/edit', {
            blog: blog,
            errors: req.flash('errors')
        });
      });
}

function processEdit (req, res) {
    // validate information
    req.checkBody('name', 'Name is required.').notEmpty();
    req.checkBody('lastname', 'Lastname is required.').notEmpty();
    req.checkBody('title', 'Title is required.').notEmpty();
    req.checkBody('description', 'Description is required.').notEmpty();

    // if there are errors redirect and save errors to flash
    const errors = req.validationErrors();
    if (errors) {
        req.flash('errors', errors.map(err => err.msg));
        return res.redirect(`/blogs/${req.params.slug}/edit`);
    }
    // finding a current blog
    Blog.findOne({ slug: req.params.slug }, (err, blog) => {
        // updating the blog
        blog.name = req.body.name,
        blog.lastname = req.body.lastname,
        blog.title = req.body.title,
        blog.description = req.body.description,
        blog.date = Date.now();

        blog.save((err) => {
            if(err) {
                res.send(err);
            }
            // set a succussful flash message
            req.flash('success', 'Blog updated successfuly.');
            //redirect to newly updated blog
            res.redirect('/blogs');
        });
    });
}

// delete a blog
function deleteBlog (req, res) {
    Blog.remove({ slug: req.params.slug}, (err) => {
        // set flash data
        req.flash('success', 'Blog deleted.');
        // redirect to /blogs
        res.redirect('/blogs');
    });
} 

// show single blog
function showSingle(req, res) {
    Blog.findOne({ slug: req.params.slug }, (err, blog) => {
        if(err) {
            res.status(404);
            res.send('blog not found')
        }
        console.log(blog);
        res.render('pages/single', { 
            blog: blog ,
            success: req.flash('success')
        });
    });
}



