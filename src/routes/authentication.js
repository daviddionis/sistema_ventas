const router=require('express').Router();
const passport=require('passport');
const {estaLogeado, noEstaLogeado}=require('../lib/auth');
const pool=require('../database'); 

router.get('/signin', noEstaLogeado, async (req,res)=>{
    res.render('auth/signin');
});
router.post('/signin',noEstaLogeado, async(req,res,next)=>{
    passport.authenticate('local.signin',{
        successRedirect: '/',
        failureRedirect: '/signin',
        failureTrue: true
    })(req,res,next);
});


router.get('/profile',estaLogeado,  async (req,res)=>{
    const productos=await pool.query('SELECT * FROM productos');
    res.render('profile', {productos});
});
router.get('/logout', (req,res)=>{
    req.logOut();
    res.redirect('/signin');
});
module.exports=router;