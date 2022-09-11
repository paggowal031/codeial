const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleFriend=async function(req,res){
    console.log("friends controller")
    return res.render('home',{
        title:"connectUs | Home",
        posts:posts,
        all_users:users
        });  
}