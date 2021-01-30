const express=require('express');
const { Passport } = require('passport');

const router=express.Router();
const passport=require('passport');


const usersController=require('../controllers/users_Controller');


router.get('/profile/:id',passport.checkAuthenticated,usersController.profile);

router.post('/update/:id',passport.checkAuthenticated,usersController.update);

router.get('/sign-in',usersController.signIn);
router.get('/sign-up',usersController.signUp);

router.post('/create',usersController.create);

//use passport as a middleware to authenticate
router.post('/create-session',passport.authenticate(
    'local',{failureRedirect: '/users/sign-in'},
),usersController.createSession);

router.get('/sign-out',usersController.destroySession);

module.exports=router;