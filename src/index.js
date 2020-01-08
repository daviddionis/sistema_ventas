const express=require('express');
const morgan=require('morgan');
const exphbs=require('express-handlebars');
const path=require('path');
const flash=require('connect-flash');
const session=require('express-session');
const MySQLStore=require('express-mysql-session');
const { database }=require('./keys');
const passport=require('passport');

//Iniciar librerias
const app=express();
require('./lib/passport');
productos_usuario=['init'];
subtotal=0;

//Configuracion
app.set('port', process.env.PORT || 80);
app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({
    defaultLayout: 'mainLayout',
    layoutsDir: path.join(app.get('views'), 'layouts'), //path.join junta directorios en diferentes sistemas
    partialsDir: path.join(app.get('views'), 'partials'),
    extname:'.hbs',
    helpers: require('./lib/handlebars')
}));
app.set('view engine', '.hbs');

//Middlewares
app.use(session({
    secret: 'mysecretapp',
    resave: false,
    saveUninitialized:false,
    store: new MySQLStore(database) 
}));
app.use(flash());
app.use(morgan('dev'));
app.use(express.urlencoded({extended: false}));
app.use(express.json());
app.use(passport.initialize());
app.use(passport.session());

//Variables Globales
app.use((req,res,next)=>{
    app.locals.success=req.flash('success');
    app.locals.failure=req.flash('failure');
    app.locals.user=req.user;
    next();
});

//Rutas
app.use(require('./routes/index'));
app.use(require('./routes/authentication'));
app.use('/venta',require('./routes/venta')); 
app.use('/admin',require('./routes/admin')); 
app.use('/stock',require('./routes/stock')); 
app.use('/links',require('./routes/links'));  //se accede mediante /links/...


//Public
app.use(express.static(path.join(__dirname, 'public')));

//Iniciar Server
app.listen(app.get('port'), ()=>console.log('Server is running on '+app.get('port')));