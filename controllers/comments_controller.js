const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=function(req,res){
    //We need to add comment to a post i.e. check whether post exist or not
    Post.findById(req.body.post,function(err,post){
        //if post found
        if(post){
            Comment.create({
                content:req.body.content,
                post:req.body.post,
                user:req.user._id
            },function(err,comment){

                if(err){
                    console.log("Error in creating a comment");
                }
                //comment created then add it to post
                post.comments.push(comment)
                post.save();
                return res.redirect('/');
            });
        }
    });
}
