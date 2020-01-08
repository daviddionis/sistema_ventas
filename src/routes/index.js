const router=require('express').Router();
const pool=require('../database');

router.get('/',async (req,res)=>{
    const productos_db= await pool.query('SELECT * FROM productos');
    res.render('index', {productos_db, productos_usuario, subtotal});
});

module.exports=router;