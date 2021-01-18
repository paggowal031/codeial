module.exports.profile=function(req,res){

    // return res.end('<h1>User profile</h1>');
    return res.render('user_profile',{
        title:"profile"
    });
};