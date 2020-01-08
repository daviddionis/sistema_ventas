const router=require('express').Router();
const pool=require('../database');
const {estaLogeado}=require('../lib/auth');

router.get('/add',estaLogeado, async (req,res)=>{
    res.render('stock/add');
});
router.post('/add', estaLogeado,async(req,res)=>{
    const nuevoProducto={
        barcode: parseInt(req.body.barcode),
        title: req.body.title,
        precio: parseFloat(req.body.precio),
        unidades: parseInt(req.body.unidades)
    }
    await pool.query('INSERT INTO productos set ?', [nuevoProducto]);
    res.redirect('/');
});
router.get('/all',estaLogeado, async(req,res)=>{
    const productos_db=await pool.query('SELECT * FROM productos');
    res.render('stock/all', {productos_db});
});
router.get('/delete/:barcode', async (req,res)=>{
    await pool.query('DELETE FROM productos WHERE barcode = ?', [req.params.barcode]);
    req.flash('success', 'Producto eliminado');
    res.redirect('/stock/all');
});
router.get('/edit/:barcode', async (req,res)=>{
    res.render('stock/edit', {producto_editar: (await pool.query('SELECT * FROM productos WHERE barcode = ?', [req.params.barcode]))[0]});
});

router.post('/edit/:barcode',async (req,res)=>{
    const updateProducto={
        barcode: parseInt(req.body.barcode),
        title: req.body.title,
        precio: parseFloat(req.body.precio),
        unidades: parseInt(req.body.unidades)
    }
    await pool.query('UPDATE productos set ? WHERE barcode = ? ', [updateProducto,parseInt(req.params.barcode)]);
    req.flash('success', 'Producto editado');
    res.redirect('/stock/all');
});

module.exports=router;