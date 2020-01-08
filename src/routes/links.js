const router=require('express').Router();
const pool=require('../database');
const {estaLogeado}=require('../lib/auth');

router.get('/add', estaLogeado,(req,res)=>{
    res.render('links/add');
});
router.post('/add', estaLogeado,async (req,res)=>{
    const {title, url, description}=req.body;
    const newLink={
        title,
        url,
        description,
        user_id: req.user.id
    };
    await pool.query('INSERT INTO links set ?', [newLink]);
    req.flash('success', 'Link guardado.');
    res.redirect('/links');

});

router.get('/delete/:id',estaLogeado, async (req,res)=>{
    const {id}=req.params;
    await pool.query('DELETE FROM links WHERE ID = ? AND user_id = ?', [id, req.user.id]);
    req.flash('success', 'Link eliminado.');
    res.redirect('/links');
});

router.get('/edit/:id', estaLogeado,async (req,res)=>{
    const {id}=req.params;
    const links=await pool.query('SELECT * FROM links WHERE ID = ? AND user_id = ?', [id, req.user.id]);
    res.render('links/edit', {link: links[0]}); //ponemos [0] para sacer el diccionario fuera de la lista
});

router.post('/edit/:id',estaLogeado,async (req,res)=>{
    const {id}=req.params;
    const {title,description,url}=req.body;
    const newLink={
        title,
        description, 
        url
    };
    await pool.query('UPDATE links set ? WHERE ID = ? AND user_id = ?', [newLink,id,req.user.id]);
    req.flash('success', 'Link editado.');
    res.redirect('/links');
});

router.get('/',estaLogeado, async (req,res)=>{
    const productos=await pool.query('SELECT * FROM productos');
    console.log(productos);
    res.render('links/list', {productos});
});


module.exports=router;