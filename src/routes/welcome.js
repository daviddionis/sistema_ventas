const router=require('express').Router();
const {existeAdmin}=require('../lib/auth');
const passport=require('passport');

router.get('/',existeAdmin,(req,res)=>res.render('welcome/crear_admin'));
router.post('/',passport.authenticate('local.primeravez', {
    successRedirect: '/admin/tienda',
    failureRedirect: '/',
    failureFlash: true
}));



module.exports=router;