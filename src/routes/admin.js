const router=require('express').Router();
const {estaLogeado, noEstaLogeado}=require('../lib/auth');
const pool=require('../database');
const passport=require('passport');

router.get('/', (req,res)=>{
    res.render('admin/panel');
});
router.get('/nuevo_empleado', estaLogeado,async (req,res)=>{
    res.render('admin/nuevo_empleado');
});

router.post('/nuevo_empleado',estaLogeado, passport.authenticate('local.signup', {
        successRedirect: '/',
        failureRedirect: '/',
        failureFlash: true
}));

module.exports=router;