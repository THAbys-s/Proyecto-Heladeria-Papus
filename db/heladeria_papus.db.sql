BEGIN TRANSACTION;
DROP TABLE IF EXISTS "sabores";
CREATE TABLE IF NOT EXISTS "sabores" (
	"sabor_id"	INTEGER,
	"nombre_sabor"	TEXT NOT NULL,
	"tienda_id"	INTEGER,
	PRIMARY KEY("sabor_id" AUTOINCREMENT),
	FOREIGN KEY("tienda_id") REFERENCES "tiendas"("tienda_id")
);
DROP TABLE IF EXISTS "especiales";
CREATE TABLE IF NOT EXISTS "especiales" (
	"especial_id"	INTEGER,
	"nombre_especial"	TEXT NOT NULL,
	"tienda_id"	INTEGER,
	PRIMARY KEY("especial_id" AUTOINCREMENT),
	FOREIGN KEY("tienda_id") REFERENCES "tiendas"("tienda_id")
);
DROP TABLE IF EXISTS "salsas";
CREATE TABLE IF NOT EXISTS "salsas" (
	"salsa_id"	INTEGER,
	"nombre_salsa"	TEXT NOT NULL,
	PRIMARY KEY("salsa_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "bocadillos";
CREATE TABLE IF NOT EXISTS "bocadillos" (
	"bocadillo_id"	INTEGER,
	"nombre_bocadillo"	TEXT NOT NULL,
	PRIMARY KEY("bocadillo_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "tiendas";
CREATE TABLE IF NOT EXISTS "tiendas" (
	"tienda_id"	INTEGER,
	"direccion"	TEXT NOT NULL,
	PRIMARY KEY("tienda_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "empleados";
CREATE TABLE IF NOT EXISTS "empleados" (
	"empleado_id"	INTEGER,
	"nombre_empleado"	TEXT NOT NULL,
	"apellido_empleado"	TEXT NOT NULL,
	"tienda_id"	INTEGER,
	PRIMARY KEY("empleado_id" AUTOINCREMENT),
	FOREIGN KEY("tienda_id") REFERENCES "tiendas"("tienda_id")
);
DROP TABLE IF EXISTS "pagos";
CREATE TABLE IF NOT EXISTS "pagos" (
	"pago_id"	INTEGER,
	"monto"	INTEGER,
	"tienda_id"	INTEGER,
	"empleado_id"	INTEGER,
	FOREIGN KEY("tienda_id") REFERENCES "tiendas"("tienda_id"),
	FOREIGN KEY("empleado_id") REFERENCES "empleados"("empleado_id"),
	PRIMARY KEY("pago_id" AUTOINCREMENT)
);
DROP TABLE IF EXISTS "inter_sabor_especial";
CREATE TABLE IF NOT EXISTS "inter_sabor_especial" (
	"sabor_id"	INTEGER,
	"especial_id"	INTEGER,
	PRIMARY KEY("sabor_id","especial_id"),
	FOREIGN KEY("sabor_id") REFERENCES "sabores"("sabor_id") ON DELETE CASCADE,
	FOREIGN KEY("especial_id") REFERENCES "especiales"("especial_id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "inter_sabor_salsa";
CREATE TABLE IF NOT EXISTS "inter_sabor_salsa" (
	"sabor_id"	INTEGER,
	"salsa_id"	INTEGER,
	FOREIGN KEY("salsa_id") REFERENCES "salsas"("salsa_id") ON DELETE CASCADE,
	FOREIGN KEY("sabor_id") REFERENCES "sabores"("sabor_id") ON DELETE CASCADE,
	PRIMARY KEY("sabor_id","salsa_id")
);
DROP TABLE IF EXISTS "inter_sabor_bocadillo";
CREATE TABLE IF NOT EXISTS "inter_sabor_bocadillo" (
	"sabor_id"	INTEGER,
	"bocadillo_id"	INTEGER,
	PRIMARY KEY("sabor_id","bocadillo_id"),
	FOREIGN KEY("sabor_id") REFERENCES "sabores"("sabor_id") ON DELETE CASCADE,
	FOREIGN KEY("bocadillo_id") REFERENCES "bocadillos"("bocadillo_id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "inter_especial_salsa";
CREATE TABLE IF NOT EXISTS "inter_especial_salsa" (
	"especial_id"	INTEGER,
	"salsa_id"	INTEGER,
	PRIMARY KEY("especial_id","salsa_id"),
	FOREIGN KEY("especial_id") REFERENCES "especiales"("especial_id") ON DELETE CASCADE,
	FOREIGN KEY("salsa_id") REFERENCES "salsas"("salsa_id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "inter_especial_bocadillo";
CREATE TABLE IF NOT EXISTS "inter_especial_bocadillo" (
	"especial_id"	INTEGER,
	"bocadillo_id"	INTEGER,
	FOREIGN KEY("especial_id") REFERENCES "especiales"("especial_id") ON DELETE CASCADE,
	FOREIGN KEY("bocadillo_id") REFERENCES "bocadillos"("bocadillo_id") ON DELETE CASCADE,
	PRIMARY KEY("especial_id","bocadillo_id")
);
DROP TABLE IF EXISTS "inter_cucurucho_sabor";
CREATE TABLE IF NOT EXISTS "inter_cucurucho_sabor" (
	"cucurucho_id"	INTEGER,
	"sabor_id"	INTEGER,
	PRIMARY KEY("cucurucho_id","sabor_id"),
	FOREIGN KEY("sabor_id") REFERENCES "sabores"("sabor_id") ON DELETE CASCADE,
	FOREIGN KEY("cucurucho_id") REFERENCES "cucuruchos"("cucurucho_id") ON DELETE CASCADE
);
DROP TABLE IF EXISTS "inter_cucurucho_especial";
CREATE TABLE IF NOT EXISTS "inter_cucurucho_especial" (
	"cucurucho_id"	INTEGER,
	"especial_id"	INTEGER,
	FOREIGN KEY("cucurucho_id") REFERENCES "cucuruchos"("cucurucho_id") ON DELETE CASCADE,
	FOREIGN KEY("especial_id") REFERENCES "especiales"("especial_id") ON DELETE CASCADE,
	PRIMARY KEY("cucurucho_id","especial_id")
);
DROP TABLE IF EXISTS "cucuruchos";
CREATE TABLE IF NOT EXISTS "cucuruchos" (
	"cucurucho_id"	INTEGER,
	"nombre_cucurucho"	TEXT,
	"precio"	INTEGER,
	PRIMARY KEY("cucurucho_id" AUTOINCREMENT)
);
COMMIT;
