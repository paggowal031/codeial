const Like=require('../models/like');
const Comment=require('../models/comment');
const Post=require('../models/post');

module.exports.toggleLike=async function(req,res){
    try{
        //       likes/toggle/?id=abcdef&type=Post
        let likeable;
        let deleted=false;

        //finding likeable
        if(req.query.type=='Post'){
            likeable=await Post.findById(req.query.id).populate('likes');
        }
        else{
            //if not Post then it will be Comment
            likeable=await Comment.findById(req.query.id).populate('likes');
        }

        //check if already likes exists
        let existingLike=await Like.findOne({
            likeable:req.query.id,
            onModel:req.query.type,
            user:req.user._id
        })
        console.log("####ExistingLike",existingLike)

        //if  a like already exist then delete it
        if(existingLike){
            //removing like from likeable and delete like object
            likeable.likes.pull(existingLike._id);
            likeable.save();
            console.log("lllllllllllllllllllllllllllllllllllllllllllllllll")
            existingLike.remove();
            deleted=true;
        }
        else{
            //else make a new like
            let newLike=await Like.create({
                user:req.user._id,
                likeable:req.query.id,
                onModel:req.query.type
            });


            likeable.likes.push(newLike._id);
            likeable.save();
        }
        
     
        return res.status(200).json({
            message:"Request successfull!",
            data:{
                deleted:deleted
            }
        })
    
    }catch(err){

        console.log(err);
        res.json(500,{
            message:"Internal server error"
        })

    }
}