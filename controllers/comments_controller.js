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

module.exports.destroy=function(req,res){
       //find the comment
       Comment.findById(req.params.id,function(err,comment){
           if(err){
            console.log("Error in finding  comment while deleting");
           }
           if(comment.user==req.user.id){
               //delete |  before delete, fetch post.id to delete from there also
               let postId=comment.post;
               comment.remove();

               Post.findByIdAndUpdate(postId,{$pull:{
                   comments:req.params.id
               }},function(err,post){
                   if(err){
                    console.log("Error in deleting comment from post");
                   }

                   return res.redirect('back');
               });
           }else{
               //if doesn't match
               return res.redirect('back');
           }
       });
}
