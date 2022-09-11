const Post=require('../models/post');
const User=require('../models/user');

let pop=async function(posts)
{
    for(postx of posts)
        {
            for(commentx of postx.comments)
            {
                await commentx.populate('user','name');
            }
        }
}

module.exports.home=async function(req,res){

  //using async await
  try{
    let posts= await Post.find({})
   .sort('-createdAt')
   .populate('user')
   .populate(
     {
       path:'comments',
       populate:{
           path:'user'
       },
       populate:{
         //populating likes for comment
         path:'likes'
       }
   }
   ).populate('likes');// populating likes for post
   
   await pop(posts);
   let users=await  User.find({});

   return res.render('home',{
    title:"connectUs | Home",
    posts:posts,
    all_users:users
    });

  }catch(err){
    // console.log("Error",err);
    req.flash('error',err);
    return;

  }
 

  /*
   //populate the user of each post
   Post.find({})
   .populate('user')
   .populate({
       path:'comments',
       populate:{
           path:'user'
       }
   })
   .exec(function(err,posts){

    User.find({},function(err,users){
     
      if(err){
        console.log("Error in fetching post from database");
       }
       
       console.log(posts);
       return res.render('home',{
       title:"connectUs | Home",
       posts:posts,
       all_users:users
       });
    });
    
    
  });
  */
}

//module.exports.actionName=function(req,res){};

