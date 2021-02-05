const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.create=async function(req,res){
 try{

   //We need to add comment to a post i.e. check whether post exist or not
   let post=await Post.findById(req.body.post);
   //if post found
   if(post){
      let comment=await Comment.create({
         content:req.body.content,
         post:req.body.post,
         user:req.user._id
       });
      
     //comment created then add it to post
     post.comments.push(comment)
     post.save();
     req.flash('success','Comment added successfully');
     return res.redirect('/');

    }
  
 }catch(err){
    //  console.log("Error",err);
    req.flash('error',err);
     return;

    }
}

module.exports.destroy=async function(req,res){
       try{


         //find the comment
      let comment=await Comment.findById(req.params.id);
          
      
      if(comment.user==req.user.id){
            //delete |  before delete, fetch post.id to delete from there also
            let postId=comment.post;
            comment.remove();

           let post=await Post.findByIdAndUpdate(postId,{$pull:{
                comments:req.params.id
           }});
           req.flash('success','Comment deleted successfully');
           return res.redirect('back');
           
        }else{
            //if doesn't match
            req.flash('error','Not Authorized');
            return res.redirect('back');
        }

       }catch{
          //  console.log("Error",err);
          req.flash('error',err);
           return;
       }
    
      
      
    }
