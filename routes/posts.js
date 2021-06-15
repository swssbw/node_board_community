const express  = require('express');
const router = express.Router();
const Post = require('../models/Post');


// @desc Index
// @route GET /posts
router.get('/', async(req, res, next) => {
  const posts = await Post.find({}).sort('-createdAt');    
  res.render('posts/index', { posts:posts });
});


// @desc new
// @route GET /posts/new
router.get('/new', async(req, res) => {
  await res.render('posts/new');
});


// @desc create
// @route POST /posts
router.post('/', async(req, res) => {
  try {
    await Post.create(req.body);
    res.redirect('/posts');
  } catch (err) {
    console.error(err);
    next(err);
  }
});


// @desc show
// @route GET /posts/:id
router.get('/:id', async (req, res) => {
  try {
    const post = await  Post.findOne({_id:req.params.id}, {});
    res.render('posts/show', {post:post});
  } catch (err) {
    console.error(err);
  }
});


// @desc edit
// @route GET /posts/:id/edit
router.get('/:id/edit', async (req, res) => {
  try{
    const post = await  Post.findOne({_id:req.params.id}, {});
    res.render('posts/edit', {post:post});
  } catch(err) {
    console.error(err);
  }
});


// @desc update
// @route PUT /posts/:id
router.put('/:id', async (req, res) => {
  try {
    req.body.updatedAt = Date.now();
    await Post.findOneAndUpdate({_id:req.params.id}, req.body, () => {
    res.redirect("/posts/"+req.params.id);
    });
  } catch (err) {
    console.error(err);
  }
});


// @desc destroy
// @route DELETE /posts/:id
router.delete('/:id', async (req, res) => {
  try {
    await Post.deleteOne({_id:req.params.id}, () => {
    res.redirect('/posts');
  });
  } catch (err) {
    console.error(err);
  }
});


module.exports = router;