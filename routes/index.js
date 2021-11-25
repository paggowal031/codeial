const express=require('express');
const router=express.Router();

const homeController=require('../controllers/home_controller');
const postsController=require('../controllers/posts_controller');
const { route } = require('./users');


console.log("router loaded");

router.get('/',homeController.home);

router.use('/users',require('./users'));

router.use('/posts',require('./post'));

router.use('/comments',require('./comments'));

router.use('/api',require('./api'));


module.exports=router;