const router=require('express').Router();
const pool=require('../database');
const fs = require('fs');
const path=require('path');
var {exec}=require('child_process');

let generarFactura=async (objeto, nombre_fichero='salida',imprimir=true)=>{
    let contenido='Tienda TuMadre\n\n';
    for(let i=0;i<objeto.length;i++){
        let obj=objeto[i];
        contenido+=obj.unidades+' ['+obj.barcode+']: '+obj.title+'    '+obj.precio+'€\n';  
    }
    contenido+='\nTotal: '+subtotal+'€';
    await fs.writeFileSync(path.join(__dirname, '../facturas/'+nombre_fichero+'.txt'), contenido, (err)=>{
        if(err) throw err;
    });
    exec(path.join(__dirname,'../facturas/'+nombre_fichero+'.txt'));
    
}
router.post('/addproducto', async (req,res)=>{
    let producto_add=await pool.query('SELECT * FROM productos WHERE title = ?', [req.body.title_producto]);
    console.log(productos_usuario.length);
    let index_repetido=-1;
    if(productos_usuario[0]!='init'){
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
        productos_usuario=[];
        producto_add[0].unidades=parseInt(req.body.unidades);
        productos_usuario.push(producto_add[0]);
    }
    subtotal+=producto_add[0].precio*parseInt(req.body.unidades);
    res.redirect('/');
});

router.post('/factura', async (req,res)=>{
    generarFactura(productos_usuario);
    productos_usuario=['init'];
    subtotal=0;
    res.redirect('/');
});


module.exports=router;