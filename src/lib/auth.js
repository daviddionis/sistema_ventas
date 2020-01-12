const pool=require('../database');

module.exports={
    async estaLogeado(req,res,next){
        const usuarios=await pool.query('SELECT * FROM empleados');
        console.log(usuarios);
        if(req.isAuthenticated()){
            return next();
        }else{
            if(usuarios[0]==null){
                res.redirect('/welcome');
            }else{
                res.redirect('/signin');
            }
        }
    },
    noEstaLogeado(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/profile');

        }
    },
    async existeAdmin(req,res,next){
        const usuarios=await pool.query('SELECT * FROM empleados');
        if(usuarios[0]==null){
            return next();
        }else{
            res.redirect('/');
        }
    }
};
