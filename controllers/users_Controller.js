const User=require('../models/user');

module.exports.profile=function(req,res){

    // return res.end('<h1>User profile</h1>');
    return res.render('user_profile',{
        title:"profile"
    });
};


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
    return res.redirect('/'); 
}

//destroy session that is sign out
module.exports.destroySession=function(req,res){
    req.logout();
    return res.redirect('/');
}
