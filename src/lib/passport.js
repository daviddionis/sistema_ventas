const passport=require('passport');
const LocalStrategy=require('passport-local').Strategy;
const pool=require('../database');
const helpers=require('../lib/helpers');


passport.use('local.signin', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username,password, done)=>{
    console.log(req.body);
    const filas=await pool.query('SELECT * FROM empleados WHERE username = ?', [username]);
    if (filas.length>0){
        const user=filas[0];
        console.log(user.password);
        console.log(password);
        const passwordOk=await helpers.compararContra(password, user.password);
        console.log(passwordOk);   
        if (passwordOk){
            console.log('Aqui llego');
            return done(null, user, req.flash('success','Bienvenido ' + user.fullname));
        }else{
            return done(null, false,req.flash('failure','Contraseña incorrecta'));
        }
    }else{
        return done(null,false, req.flash('failure','El usuario no es correcto'));
    }

}));

passport.use('local.signup', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username, password, done)=>{
    const newUser={
        username,
        password,
        fullname: req.body.fullname
    };
    if (req.body.is_admin=='Empleado'){
        newUser.is_root=false;
    }else if (req.body.is_admin=='Administrador'){
        newUser.is_root=true;
    }else{
        newUser.is_root=false;
    }
    if(req.user.is_root){
        newUser.password=await helpers.encriptarContra(password);
        const result=await pool.query('INSERT INTO empleados SET ?', [newUser]);
        newUser.id=result.insertId; //id que nos da mysql
        return done(null, req.user, req.flash('success','Usuario creado')); //callback necesario;
    }else{
        return done(null, req.user, req.flash('failure','Empleado no autorizado, el intento sera reportado.'));
    }
    
}));

passport.use('local.primeravez', new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password',
    passReqToCallback: true
}, async (req,username, password, done)=>{
    const newUser={
        username,
        password,
        fullname: req.body.fullname
    };
    if (req.body.is_admin=='Administrador'){
        newUser.is_root=true;
    }else{
        newUser.is_root=false;
    }
    newUser.password=await helpers.encriptarContra(password);
    const result=await pool.query('INSERT INTO empleados SET ?', [newUser]);
    newUser.id=result.insertId; //id que nos da mysql
    return done(null, newUser, req.flash('success','Usuario creado')); //callback necesario;
    
}));

passport.serializeUser((user, done)=>{
    done(null, user.id);
});

passport.deserializeUser(async (id, done)=>{
    const filas=await pool.query('SELECT * FROM empleados WHERE id = ?', [id]);
    done(null, filas[0]);
});