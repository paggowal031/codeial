const nodemailer=require('../config/nodemailer');

exports.newComment=(comment)=>{

    console.log('**************888888inside new comment mailer',comment);

    //rendering html template
    let htmlString=nodemailer.renderTemplate({comment:comment},'comments/new_comment.ejs');
    //sending email

    nodemailer.transporter.sendMail({
        from:'info.connectus24x7@gmail.com',
        to: comment.user.email,
        subject:'New Comment Published!',
        html:htmlString
    },(err,info)=>{
        
        if(err){
            console.log('error in sending email',err);
            return;
        }

        console.log('Message sent ', info);
        return;
    });
}