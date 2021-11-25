const User=require('../models/user');
const fs=require('fs');
const path=require('path');


module.exports.profile=function(req,res){

    // return res.end('<h1>User profile</h1>');

    //find user
    User.findById(req.params.id,function(err,user){
        if(err){
            req.flash('error','Error in showing user profile');
            console.log("Error in showing user profile");
        }
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
        });
    });
   
}

module.exports.update=async function(req,res){
   /* if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            console.log(req.body);
            if(err){
                req.flash('error','Error in updating user');
                console.log("Error in updating user");
            }
            return res.redirect('back');
        });

    }else{
        return res.status(401).send('UnAuthorized');
    }
    */


   if(req.user.id==req.params.id){

    try{
        //finding user
        let user=await User.findById(req.params.id);

        //updating user
        User.uploadedAvatar(req,res,function(err){
            if(err){
                console.log('*****Multer error',err);
            }
            console.log(req.file);
            user.name=req.body.name;
            user.email=req.body.email;
            user.phone=req.body.phone;
            user.dob=req.body.dob;

            if(req.file){
//where is upload folder? now its workking yeah resolve
                //check if user already has an avatar associated with him/her,if present then remove avatar and upload new one
                if(user.avatar){
                    fs.unlinkSync(path.join(__dirname,'..',user.avatar));
                }

                //this is saving the path of the uploaded file into the avatar field in the user
                user.avatar=User.avatarPath+'/'+req.file.filename;
            }
            user.save();

            return res.redirect('back');

        });
    }catch(err){
      req.flash('err',err);
      return res.redirect('back');
      }

   }
}


//For sign in
module.exports.signIn=function(req,res){

    if(req.isAuthenticated()){
      return  res.redirect('/users/profile')
    }

   return res.render('user_sign_in',{
        title:"Codeial | Sign In"
    });
};

//for sign up
module.exports.signUp=function(req,res){

    if(req.isAuthenticated()){
      return  res.redirect('/users/profile')
    }

   return res.render('user_sign_up',{
        title:"Codeial | Sign Up"
    });
};

//get the sign up data
module.exports.create=function(req,res){
   
    //first check whether password and confirm password are same or not



    //HAVING A PROBLEM HERE




    // if(req.body.passowrd!=req.body.confirm_password){
    //     req.flash('error','Password and Confirm password does not match');
    // return res.redirect('back');
    // }







    
    //if both password are same then check whether a user with same email id is present or not
    User.findOne({email:req.body.email},function(err,user){
        if(err){
            console.log("Error in finding user in signing up");
            return;
        }
        //when user not found 
        if(!user){
            //create a user
            User.create(req.body,function(err,user){
                if(err){
                    console.log(req.body);
                    console.log("Error in creating user while signing up");
                     return; 
                }
                //if successfully created
                return res.redirect('/users/sign-in');
            });
        }else{
            //if user already present
            console.log(user);
            req.flash('error','Error || User Already Exist');
            console.log("Error||User already exist");
            return res.redirect('back');
        }
    });
}


//create session between user and server (SIGN IN)
module.exports.createSession=function(req,res){
    req.flash('success','Logged in successfully');
    return res.redirect('/'); 
}

//destroy session that is sign out
module.exports.destroySession=function(req,res){
    req.flash('success','Logged Out successfully');
    req.logout();
    return res.redirect('/');
}
