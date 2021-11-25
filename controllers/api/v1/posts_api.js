const Post=require('../../../models/post');
const Comment=require('../../../models/comment')

module.exports.index=async function(req,res){
    
    
    let posts= await Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate({
       path:'comments',
       populate:{
           path:'user'
       }
   });

    return res.json(200,{
        message:"List of posts",
        posts:posts
    })
}

module.exports.destroy=async function(req,res){

    try{

        //before deleting find whether post exist or  not
   let post= await Post.findById(req.params.id);

   //.id means converting the object id into string
   if(post.user==req.user.id){
       post.remove();

           await Comment.deleteMany({post:req.params.id});

    

           return res.json(200,{
            message:"post successfully deleted"
        })
           }else{
           //if both user doesn't match
           return res.json(401,{
               message:"You cannot delete post"
           })
       }

    }catch(err){
        // console.log("Errorr",err);
        return res.status(500).json( message,"Inernal Server Error")

    }
    
    
}