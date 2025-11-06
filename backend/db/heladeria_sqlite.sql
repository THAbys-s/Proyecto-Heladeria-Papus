PRAGMA foreign_keys = ON;

CREATE TABLE tiendas (
    tienda_id INTEGER PRIMARY KEY AUTOINCREMENT,
    direccion TEXT NOT NULL
);

CREATE TABLE empleados (
    empleado_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_empleado TEXT NOT NULL,
    apellido_empleado TEXT NOT NULL,
    tienda_id INTEGER,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(tienda_id)
);

CREATE TABLE sabores (
    sabor_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_sabor TEXT NOT NULL,
    tienda_id INTEGER,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(tienda_id)
);

CREATE TABLE salsas (
    salsa_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_salsa TEXT NOT NULL
);

CREATE TABLE bocadillos (
    bocadillo_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_bocadillo TEXT NOT NULL
);

CREATE TABLE cucuruchos (
    cucurucho_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_cucurucho TEXT NOT NULL,
    precio REAL NOT NULL
);

CREATE TABLE especiales (
    especial_id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre_especial TEXT NOT NULL,
    tienda_id INTEGER,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(tienda_id)
);

CREATE TABLE productos (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    precio REAL NOT NULL,
    precioOriginal REAL NOT NULL,
    descuento INTEGER NOT NULL
);

CREATE TABLE pagos (
    pago_id INTEGER PRIMARY KEY AUTOINCREMENT,
    monto REAL NOT NULL,
    tienda_id INTEGER,
    empleado_id INTEGER,
    FOREIGN KEY (tienda_id) REFERENCES tiendas(tienda_id),
    FOREIGN KEY (empleado_id) REFERENCES empleados(empleado_id)
);

CREATE TABLE comentarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    producto_id INTEGER,
    usuario_id INTEGER,
    comentario TEXT,
    fecha TEXT,
    FOREIGN KEY (producto_id) REFERENCES productos(id)
);

CREATE TABLE usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nombre TEXT NOT NULL,
    email TEXT NOT NULL,
    password TEXT NOT NULL,
    fecha_creacion TEXT,
    access TEXT
);

CREATE TABLE inter_cucurucho_sabor (
    cucurucho_id INTEGER,
    sabor_id INTEGER,
    FOREIGN KEY (cucurucho_id) REFERENCES cucuruchos(cucurucho_id),
    FOREIGN KEY (sabor_id) REFERENCES sabores(sabor_id)
);

CREATE TABLE inter_cucurucho_especial (
    cucurucho_id INTEGER,
    especial_id INTEGER,
    FOREIGN KEY (cucurucho_id) REFERENCES cucuruchos(cucurucho_id),
    FOREIGN KEY (especial_id) REFERENCES especiales(especial_id)
);

CREATE TABLE inter_especial_bocadillo (
    especial_id INTEGER,
    bocadillo_id INTEGER,
    FOREIGN KEY (especial_id) REFERENCES especiales(especial_id),
    FOREIGN KEY (bocadillo_id) REFERENCES bocadillos(bocadillo_id)
);

CREATE TABLE inter_especial_salsa (
    especial_id INTEGER,
    salsa_id INTEGER,
    FOREIGN KEY (especial_id) REFERENCES especiales(especial_id),
    FOREIGN KEY (salsa_id) REFERENCES salsas(salsa_id)
);

CREATE TABLE inter_sabor_bocadillo (
    sabor_id INTEGER,
    bocadillo_id INTEGER,
    FOREIGN KEY (sabor_id) REFERENCES sabores(sabor_id),
    FOREIGN KEY (bocadillo_id) REFERENCES bocadillos(bocadillo_id)
);

CREATE TABLE inter_sabor_especial (
    sabor_id INTEGER,
    especial_id INTEGER,
    FOREIGN KEY (sabor_id) REFERENCES sabores(sabor_id),
    FOREIGN KEY (especial_id) REFERENCES especiales(especial_id)
);

CREATE TABLE inter_sabor_salsa (
    sabor_id INTEGER,
    salsa_id INTEGER,
    FOREIGN KEY (sabor_id) REFERENCES sabores(sabor_id),
    FOREIGN KEY (salsa_id) REFERENCES salsas(salsa_id)
);

INSERT INTO tiendas VALUES
(1,'Av. Leticia'),(2,'Av. Santa Fe 1450, Recoleta, CABA'),
(3,'Av. Rivadavia 7200, Flores, CABA'),(4,'Av. Cabildo 2300, Belgrano, CABA'),
(5,'Av. Hipólito Yrigoyen 12500, Adrogué, Buenos Aires'),
(6,'Calle Mitre 850, Lomas de Zamora, Buenos Aires'),
(7,'Av. Maipú 3200, Olivos, Buenos Aires'),(8,'Av. San Martín 510, Ramos Mejía, Buenos Aires'),
(9,'Av. Juan B. Justo 8900, Palermo, CABA'),(10,'Av. Libertador 15050, San Isidro, Buenos Aires'),
(11,'Bv. San Juan 700, Córdoba Capital'),(12,'Francisco Camet 4591, Barrio Olímpico');

INSERT INTO empleados VALUES
(1,'Diego','Ajata Ledezma',1),(2,'Juanma','Parrado',1),(3,'Enzo','Materazzi',1),
(4,'Santiago Ezequiel','Gomez Burzolino',2),(5,'Thomas','Avila',3),
(6,'Dylan','Aragon',4),(7,'Liam Thierry','Leyenda',5),(8,'Valentin','Velasquez',6),
(9,'Federico','Villace',7),(10,'Tomas','Mayorga',8),(11,'Julian','Navarro',9),
(12,'Julian','Impeluso',10),(13,'Eduardo','Mestrovich',1),(14,'Jose','Albornoz',2),
(15,'Axel','Burgos',12),(16,'Nicolás','Arrieta',12),(17,'Santino','Lopez',12),
(18,'Lautaro','Villanueva',12),(19,'Thiago','Bustos',12);

INSERT INTO bocadillos VALUES
(1,'Obleas'),(2,'Chocolate KitKat'),(3,'Rocklets'),(4,'Chispas de Chocolate'),
(5,'Galletitas Oreo'),(6,'Brownie'),(7,'Galletitas de Vainilla'),(8,'Cubitos de Chocolate Blanco'),
(9,'Gomitas'),(10,'Cereales'),(11,'Pedacitos de Alfajor'),(12,'Trozos de Banana'),
(13,'Trozos de Frutilla'),(14,'Barra de Cereal'),(15,'Turrón Picado'),(16,'Bombones'),
(17,'Confites de Chocolate'),(18,'Bizcochuelo de Chocolate'),(19,'Pedacitos de Waffle'),
(20,'Trozos de Tarta de Limón');

INSERT INTO salsas VALUES
(1,'Salsa de Frutilla'),(2,'Salsa de Chocolate'),(3,'Salsa de Dulce de Leche'),
(4,'Salsa de Caramelo'),(5,'Salsa de Frutos Rojos');

INSERT INTO cucuruchos VALUES
(1,'Cucurucho Simple',1800),(2,'Cucurucho Doble',3000),(3,'Capelina',2800),
(4,'Pote de 1/4Kg',3500),(5,'Pote de 1/2Kg',6600),(6,'Pote de 1Kg',12000);

INSERT INTO sabores VALUES
(1,'Vainilla',1),(2,'Chocolate',1),(3,'Frutilla',1),(4,'Dulce de Leche',1),
(5,'Frambuesa',1),(6,'Limón',1),(7,'Banana Split',1),(8,'Granizado',1),
(9,'Tiramisú',1),(10,'Durazno',1);

INSERT INTO especiales VALUES
(1,'Tramontana',1),(2,'Flan',1);

INSERT INTO productos VALUES
(1,'Crujido Tentador',2200,2500,12),(2,'Boscado Celestial',2300,2600,12),
(3,'Dulce Suspiro',2300,2600,12),(4,'Duo Delicia',2300,2600,12),
(5,'Vainilla Sueño',2100,2400,13),(6,'Frescura Tropical',2100,2400,13),
(7,'Frutilla Encantada',2100,2400,13),(8,'Chocolate Divino',2100,2400,13),
(9,'Palito Bombón',1800,2000,10),(10,'Palito Vainillita',1800,2000,10),
(11,'Palito Rosado',1800,2000,10),(12,'Crujido Almendrado',3500,4000,13),
(13,'Trio Tentador',3500,4000,13),(14,'Sueño Chocolatoso',3500,4000,13),
(15,'Beso De Amor',3500,4000,13),(16,'Sundae Frutal',2000,2300,13),
(17,'Sundae Go',2000,2300,13);

INSERT INTO pagos VALUES
(1,3300,1,1),(2,6500,1,2),(3,3900,1,2),(4,7800,1,1),
(5,2500,1,1),(6,3300,1,2),(7,4500,1,2),(8,1200,1,1);
