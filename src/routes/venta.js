const router=require('express').Router();
const pool=require('../database');
const fs = require('fs');
const path=require('path');
const {exec}=require('child_process');
const {estaLogeado}=require('../lib/auth');
const factura=require('../lib/factura');


router.post('/addproducto', async (req,res)=>{
    let producto_add=await pool.query('SELECT * FROM productos WHERE title = ?', [req.body.title_producto]);
    console.log(productos_usuario.length);
    let index_repetido=-1;
    if(productos_usuario[0]!=null){
        for(let i=0; i<productos_usuario.length; i++){
            if(productos_usuario[i].barcode==producto_add[0].barcode){
                index_repetido=i;
                break;
            }
        }
        if(index_repetido<0){
            producto_add[0].unidades=parseInt(req.body.unidades);
            productos_usuario.push(producto_add[0]);
        }else{
            productos_usuario[index_repetido].unidades+=parseInt(req.body.unidades);
        }
    }else{
        producto_add[0].unidades=parseInt(req.body.unidades);
        productos_usuario.push(producto_add[0]);
    }
    subtotal+=producto_add[0].precio*parseInt(req.body.unidades);
    subtotal.toFixed(2);
    res.redirect('/');
});

router.post('/factura', async (req,res)=>{
    const cliente={
        nombre: 'DEV',
        dni_cif: 'DEV',
        primera_direccion: 'DEV',
        segunda_direccion: 'DEV',
        numero_factura: 'DEV',
        saldo_pendiente: 'DEV'
    }
    factura.generar(tienda,cliente,productos_usuario, '11/02/2020');
    productos_usuario=[];
    subtotal=0;
    res.redirect('/');
});
router.get('/',estaLogeado,async (req,res)=>{
    const productos_db= await pool.query('SELECT * FROM productos');
    res.render('index', {productos_db, productos_usuario, subtotal:subtotal.toFixed(2)});
});
router.get('/limpiar', estaLogeado, async (req,res)=>{
    productos_usuario=['init'];
    subtotal=0;
    res.redirect('/venta');
});

module.exports=router;