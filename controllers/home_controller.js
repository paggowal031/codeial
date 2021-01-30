const Post=require('../models/post');
const User=require('../models/user');

module.exports.home=async function(req,res){


  //using async await
  try{
    let posts= await Post.find({})
   .populate('user')
   .populate({
       path:'comments',
       populate:{
           path:'user'
       }
   });

   let users=await  User.find({});

   return res.render('home',{
    title:"connectUs | Home",
    posts:posts,
    all_users:users
    });

  }catch(err){
    console.log("Error",err);
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

