const Post=require('../models/post');
const Comment=require('../models/comment');


module.exports.create=function(req,res){
    Post.create({
        content:req.body.content,
        user:req.user._id
    },function(err,post){
        if(err){
            console.log("Error in creating a post");
            return;
        }

        return res.redirect('back');
    });
};

module.exports.destroy=function(req,res){
    //before deleting find whether post exist or not
    Post.findById(req.params.id,function(err,post){
        if(err){
            console.log("Error in finding post for delete");
        }
        //.id means converting the object id into string
        if(post.user==req.user.id){
            post.remove();

            Comment.deleteMany({post:req.params.id},function(err){
                if(err){
                console.log("Error in removing comments from post ");
                }
                return res.redirect('back');
            });
        }else{
            //if both user doesn't match
            return res.redirect('back');
        }
    });
}


