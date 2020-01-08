module.exports={
    estaLogeado(req,res,next){
        if(req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/signin');
        }
    },
    noEstaLogeado(req,res,next){
        if(!req.isAuthenticated()){
            return next();
        }else{
            res.redirect('/profile');

        }
    }
};
