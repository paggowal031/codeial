const Comment=require('../models/comment');
const Post=require('../models/post');

const commentsMailer=require('../mailers/comments_mailer');


const commentEmailWorker=require('../workers/comment_email_worker');

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
    
     await comment.populate('user','name email');

     //commentsMailer.newComment(comment);

     //Now we will use worker
     let job=queueMicrotask.create('emails',comment).save(function(err){
         if(err){
             console.log('Error in creating a queue',err);
         }

         console.log('job id:  ',job.id);
     })


     if(req.xhr){
      //similar for comments to fetch the user id
      


      return res.status(200).json({
         data:{
            comment:comment
         },
         message:"post created"
      });

   }
     req.flash('success','Comment added successfully');
     return res.redirect('/');

   }
  
 }catch(err){
    //  console.log("Error",err);
    req.flash('error',err);
     return;

    }
}

module.exports.destroy = async function(req, res){

   try{
       let comment = await Comment.findById(req.params.id);

       if (comment.user == req.user.id){

           let postId = comment.post;

           comment.remove();

           let post = Post.findByIdAndUpdate(postId, { $pull: {comments: req.params.id}});

           // send the comment id which was deleted back to the views
           if (req.xhr){
               return res.status(200).json({
                   data: {
                       comment_id: req.params.id
                   },
                   message: "Post deleted"
               });
           }


           req.flash('success', 'Comment deleted!');

           return res.redirect('back');
       }else{
           req.flash('error', 'Unauthorized');
           return res.redirect('back');
       }
   }catch(err){
       req.flash('error', err);
       return;
   }
   
}