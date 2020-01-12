const router=require('express').Router();
const {estaLogeado, noEstaLogeado}=require('../lib/auth');
const pool=require('../database');
const passport=require('passport');
const fs=require('fs');
const path=require('path');

router.get('/', (req,res)=>{
    res.render('admin/panel');
});
router.get('/nuevo_empleado', estaLogeado,async (req,res)=>{
    res.render('admin/nuevo_empleado');
});

router.post('/nuevo_empleado',estaLogeado, passport.authenticate('local.signup', {
        successRedirect: '/admin/empleados',
        failureRedirect: '/',
        failureFlash: true
}));
router.get('/tienda', estaLogeado,async (req,res)=>{
    res.render('admin/tienda', {tienda});
});
router.post('/editar_tienda', estaLogeado, async (req,res)=>{
    let lectura='barcode', factura='a4';
    if(req.body.tipo_lectura=='Título producto') lectura='title';
    if(req.body.tipo_factura=='Impresora factura') facutra='a2';
    await fs.writeFileSync(path.join(__dirname, '../../config.txt'), `${req.body.nombre};${req.body.nombre_fiscal};${req.body.cif_dni};${req.body.primera_direccion};${req.body.segunda_direccion};${lectura};${factura}`);
    config=await fs.readFileSync(path.join(__dirname, '../../config.txt'), 'utf8').split(';');
    tienda={
        nombre: config[0],
        nombre_fiscal: config[1],
        cif_dni: config[2],
        primera_direccion: config[3],
        segunda_direccion: config[4],
        lectura: config[5],
        factura: config[6]
    }
    res.redirect('/admin/tienda');
});
router.get('/empleados',estaLogeado, async(req,res)=>{
    let empleados=await pool.query('SELECT * FROM empleados');
    res.render('admin/empleados', {empleados});
});
router.get('/empleados/delete/:id', estaLogeado, async (req,res)=>{
    console.log(req.user.is_root);
    if(req.user.is_root){
        await pool.query('DELETE FROM empleados WHERE id = ?', [req.params.id]);
        req.flash('success', 'Empleado eliminado');
        
    }else{
        req.flash('failure','Empleado no autorizado, el intento sera reportado.');
    }
    res.redirect('/admin/empleados');
});

module.exports=router;