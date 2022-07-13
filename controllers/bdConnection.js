const { Pool } = require('pg'); // Pool es una clase que viene en el paquete pg(postgres)

const db = new Pool({
    host: process.env['DATABASE_HOST'],
    user: process.env['DATABASE_USER'],
    password: process.env['DATABASE_PASSWORD'],
    database: process.env['DATABASE_DB'],
    port: process.env['DATABASE_PORT']
});

module.exports = {
    db
}