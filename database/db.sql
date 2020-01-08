CREATE DATABASE sistema_ventas;;

USE sistema_ventas;

---Users table
CREATE TABLE empleados(
    id INT(11) NOT NULL ,
    username VARCHAR(16) NOT NULL ,
    password VARCHAR(60) NOT NULL ,
    fullname VARCHAR(50) NOT NULL, 
    is_root BOOLEAN NOT NULL
);

ALTER TABLE empleados
    ADD PRIMARY KEY (id);

ALTER TABLE empleados
    MODIFY id INT(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

DESCRIBE empleados;

--Links Table
CREATE TABLE productos(
    barcode INT(11) NOT NULL,
    title VARCHAR(20) NOT NULL,
    precio FLOAT(24) NOT NULL,
    unidades INT(10) NOT NULL

);

ALTER TABLE productos
    ADD PRIMARY KEY (barcode);

DESCRIBE productos;