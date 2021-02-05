const Post=require('../models/post');
const Comment=require('../models/comment');


module.exports.create=async function(req,res){
     try{
        await Post.create({
            content:req.body.content,
            user:req.user._id
        });
        req.flash('success','Post published!')
        return res.redirect('back');
       

     }catch(err){
        // console.log("Errorr",err);
        req.flash('error',err)
        return res.redirect('back');

     }
  
    
}

module.exports.destroy=async function(req,res){

    try{

        //before deleting find whether post exist or  not
   let post= await Post.findById(req.params.id);

   //.id means converting the object id into string
   if(post.user==req.user.id){
       post.remove();

           await Comment.deleteMany({post:req.params.id});
           req.flash('success','Post and associated comments deleted')
           return res.redirect('back');
   }else{
           //if both user doesn't match
           req.flash('error','Not authorized to delete')
           return res.redirect('back');
       }

    }catch(err){
        // console.log("Errorr",err);
        req.flash('error',err);
        return;

    }
    
    
}


