const mysql=require('mysql');

const {database}=require('./keys'); //solo importo database
const {promisify}=require('util');

const pool=mysql.createPool(database);

pool.getConnection((err,connection)=>{
    if (err){
        if (err.code=='PROTOCOL_CONNECTION_LOST') console.error('Conexion perdida');
        if (err.code=='ER_CON_COUT_ERROR') console.error('La base de datos tiene demasiados conexiones');
        if (err.code=='ECONNREFUSED') console.error('Conexion Rechazada');
    }
    if (connection){
        connection.release();
        console.log('La Base de Datos está conectada');
    }
    return;
});

//De esta manera podemos hacer promesas
pool.query=promisify(pool.query);

module.exports=pool;