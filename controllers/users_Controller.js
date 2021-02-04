const User=require('../models/user');

module.exports.profile=function(req,res){

    // return res.end('<h1>User profile</h1>');

    //find user
    User.findById(req.params.id,function(err,user){
        if(err){
            console.log("Error in showing user profile");
        }
        return res.render('user_profile',{
            title:"user profile",
            profile_user:user
        });
    });
   
}

module.exports.update=function(req,res){
    if(req.user.id==req.params.id){
        User.findByIdAndUpdate(req.params.id,req.body,function(err,user){
            console.log(req.body);
            if(err){
                console.log("Error in updating user");
            }
            return res.redirect('back');
        });

    }else{
        return res.status(401).send('UnAuthorized');
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
    if(req.body.passowrd!=req.body.confirm_password){
    //return res.redirect('back');
    }
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
