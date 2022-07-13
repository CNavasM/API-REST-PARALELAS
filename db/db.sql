/*
*La base de datos requiere de las siqguientes tablas, que luego seran llamadas y agregadas
*al postgres mediante el Docker
*/

CREATE TABLE IF NOT EXISTS estudent(
    id SERIAL PRIMARY KEY,
    email VARCHAR,
    nombre VARCHAR
);

CREATE TABLE IF NOT EXISTS section(
    id SERIAL PRIMARY KEY,
    nombre VARCHAR NOT NULL
);

CREATE TABLE IF NOT EXISTS assistance(
    id SERIAL PRIMARY KEY,
    email VARCHAR NOT NULL,
    sala VARCHAR NOT NULL,
    section VARCHAR NOT NULL,
    entrada VARCHAR,
    salida VARCHAR
);

CREATE TABLE IF NOT EXISTS course(
    id SERIAL PRIMARY KEY,
    id_section INT NOT NULL,
    id_estudent INT NOT NULL,
    CONSTRAINT fk_section
        FOREIGN KEY(id_section)
            references section(id),
    CONSTRAINT fk_estudent
        FOREIGN KEY(id_estudent)
            references estudent(id)
);