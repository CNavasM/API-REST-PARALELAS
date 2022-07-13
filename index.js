const express = require('express'); //va hacia la libreria de express
const cors = require('cors'); //seguridad
const fs = require('fs'); //Para leer archivos de una bas de dato
const os = require('os');  // Para dartos del sistema
const moment = require('moment'); //se ocupa para obtener una fecha
const app = express();
const { db } = require('./controllers/bdConnection'); // conexion hacia la base de dato
const swaggerjsdoc = require('swagger-jsdoc');   //Funciones para la utilización de Swagger
const swaggerUi = require('swagger-ui-express');

const sql = fs.readFileSync('./db/db.sql').toString(); //la tabla de sql, lo va a leer del archivo sql y lo convertira en un string para despues utilizarlo

async function InitDataBase(){ //inicia la base de datos
    try {
        var queryEstudiante = 'select exists(select 1 from estudent where nombre=$1)'
        var queryCrear = 'INSERT INTO estudent(email,nombre) VALUES($1,$2)'               //Creación de la base de datos
        var respuesta = await db.query(queryEstudiante,['Camilo'])
        var respuesta2 = await db.query(queryEstudiante,['Sebastian'])
        var respuesta3 = await db.query('select exists(select 1 from section where nombre=$1)',['INFB8090'])
        var respuesta4 = await db.query('select exists(select 1 from course where id_section=$1 AND id_estudent=$2)',[1,1])
        if(respuesta['rows'][0]['exists'] === false){ // dentro de la base de datos en respuestas nos dirigimos a lo que es columna, 0 indicando el primer valor y si existe o no
            await db.query(queryCrear,['camilo.navasm@utem.cl','Camilo'])           //Pruebas de Estudiante Camilo Navas para el llamado a la Base de datos
        }
        if(respuesta2['rows'][0]['exists'] === false){
            await db.query(queryCrear,['ssalazar@utem.cl','Sebastian'])         //Inserción de profesor en la base de datos
        }
        if(respuesta3['rows'][0]['exists'] === false){
            await db.query('INSERT INTO section(nombre) VALUES($1)',['INFB8090'])               //Ingresar Sección a la base de datos
        }
        if(respuesta4['rows'][0]['exists'] === false){
            await db.query('INSERT INTO course(id_section,id_estudent) VALUES($1,$2)',[1,2])    
        }
    } catch (error) {
        console.log('Error al crear datos en las tablas:',error);                   //mensaje de error en el caso que no se puedan crear tablas
    }
};

InitDataBase();

app.use(express.json()); //la app indica que siempre usara el json de express
app.use(express.urlencoded({ extended: false })); // para que pueda funcionar los cors
app.use(cors()); //inicializa los cors

const PORT = process.env.PORT || 4000; //indica el puerto donde estara alojado

app.use((req, res, next) => { // la funcion de esta app es que cors pueda funcionar
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
    res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
    res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE', 'OPTIONS', 'HEAD');
    next();
});

app.use(require('./routes/indexRoutes'));              //Llama al archivo indexRoutes alojado en la carpeta routes para ser usado por la api

app.listen(PORT, () => {                                //Funcion que despliega la informacion del puerto, hora, día, servidor y Sistema operativo utilizado.
    let data = getHostInfo();
    console.log(data);
    console.log(`Servidor iniciado en ${PORT}`);
});


function getHostInfo() {
    let date = moment().format('MMMM Do YYYY, h:mm:ss a');
    let hostInfo = `Fecha: ${date}\nHost: ${os.hostname()}\nSistema Operativo: ${os.type()}\nServidor: NodeJS ${process.version}\n`;
    return hostInfo;
};

//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
///                                                SWAGGER                                                                             ///
//////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

// Se crean los datos del Swagger haciendo las llamadas a las funciones integradas en indexRoutes.js
// Se inicializa un Swagger Api en la siguiente URL: "http://localhost:4000/api-docs/"

const options = {
    swaggerDefinition: {
      
         "openapi": "3.0.1",
         "info": {
           "title": "API-GRUPO-J",
           "version": "V1"
         },
         "servers": [
           {
             "url": "http://localhost:4000",
             "description": "GRUPO J REST API"
           }
         ],
         "paths": {
           "/grupo-J/getout": {
             "post": {
               "tags": [
                 "Rest-Clases"
               ],
               "description": "Información de salida a la sala de clases",
               "operationId": "getout",
               "parameters": [
                 {
                   "name": "JWT",
                   "in": "header",
                   "required": true,
                   "schema": {
                     "type": "string"
                   }
                 }
               ],
               "requestBody": {
                 "content": {
                   "application/json": {
                     "schema": {
                       "$ref": "#/components/schemas/Leaving"
                     }
                   }
                 },
                 "required": true
               },
               "responses": {
                 "200": {
                   "description": "Objeto con la información de asistencia",
                   "content": {
                     "application/json": {
                       "schema": {
                         "$ref": "#/components/schemas/Leaving"
                       }
                     }
                   }
                 }
               }
             }
           },
           "/grupo-J/getin": {
             "post": {
               "tags": [
                 "Rest-Clases"
               ],
               "description": "Información de entrada a la sala de clases",
               "operationId": "getin",
               "parameters": [
                 {
                   "name": "JWT",
                   "in": "header",
                   "required": true,
                   "schema": {
                     "type": "string"
                   }
                 }
               ],
               "requestBody": {
                 "content": {
                   "application/json": {
                     "schema": {
                       "$ref": "#/components/schemas/Entrance"
                     }
                   }
                 },
                 "required": true
               },
               "responses": {
                 "200": {
                   "description": "Objeto con la información de asistencia",
                   "content": {
                     "application/json": {
                       "schema": {
                         "$ref": "#/components/schemas/Attendance"
                       }
                     }
                   }
                 }
               }
             }
           },
           "/grupo-J/asistencias": {
             "get": {
               "tags": [
                 "Rest-Clases"
               ],
               "description": "Información de asistencia",
               "operationId": "asistencias",
               "parameters": [
                 {
                   "name": "JWT",
                   "in": "header",
                   "required": true,
                   "schema": {
                     "type": "string"
                   }
                 }
               ],
               "responses": {
                 "200": {
                   "description": "Objeto con la información de asistencia",
                   "content": {
                     "application/json": {
                       "schema": {
                         "type": "array",
                         "items": {
                           "$ref": "#/components/schemas/Attendance"
                         }
                       }
                     }
                   }
                 }
               }
             }
           },
           "/grupo-J/login": {
             "get": {
               "tags": [
                 "Rest-de-Autentificación"
               ],
               "description": "Mecanismo para hacer login con cuenta de correo utem",
               "operationId": "login",
               "responses": {
                 "200": {
                   "description": "Objeto con los datos de redirección.",
                   "content": {
                     "application/json": {
                       "schema": {
                         "$ref": "#/components/schemas/LoginResponse"
                       }
                     }
                   }
                 }
               }
             }
           }
         },
         "components": {
           "schemas": {
             "Leaving": {
               "required": [
                 "classroom",
                 "entrance",
                 "leaving",
                 "subject"
               ],
               "type": "object",
               "properties": {
                 "classroom": {
                   "type": "string",
                   "description": "Código de la sala de Clases",
                   "example": "M1-301"
                 },
                 "subject": {
                   "type": "string",
                   "description": "Código de la asignatura",
                   "example": "INFB8090"
                 },
                 "entrance": {
                   "type": "string",
                   "description": "Fecha de entrada",
                   "format": "date-time"
                 },
                 "leaving": {
                   "type": "string",
                   "description": "Fecha de salida",
                   "format": "date-time"
                 }
               }
             },
             "Attendance": {
               "required": [
                 "classroom",
                 "email",
                 "entrance",
                 "leaving",
                 "subject"
               ],
               "type": "object",
               "properties": {
                 "classroom": {
                   "type": "string",
                   "description": "Código de la sala de Clases",
                   "example": "M1-301"
                 },
                 "subject": {
                   "type": "string",
                   "description": "Código de la asignatura",
                   "example": "INFB8090"
                 },
                 "entrance": {
                   "type": "string",
                   "description": "Fecha de entrada",
                   "format": "date-time"
                 },
                 "leaving": {
                   "type": "string",
                   "description": "Fecha de salida",
                   "format": "date-time"
                 },
                 "email": {
                   "type": "string",
                   "description": "Correo Electrónico",
                   "example": "camilo.navasm@utem.cl"
                 }
               }
             },
             "Entrance": {
               "required": [
                 "classroom",
                 "entrance",
                 "subject"
               ],
               "type": "object",
               "properties": {
                 "classroom": {
                   "type": "string",
                   "description": "Código de la sala de Clases",
                   "example": "M1-301"
                 },
                 "subject": {
                   "type": "string",
                   "description": "Código de la asignatura",
                   "example": "INFB8090"
                 },
                 "entrance": {
                   "type": "string",
                   "description": "Fecha de entrada",
                   "format": "date-time"
                 },
                 "leaving": {
                  "type": "string",
                  "description": "Fecha de salida",
                  "format": "date-time"
               },
               "email": {
                "type": "string",
                "description": "Correo Electrónico",
                "example": "camilo.navasm@utem.cl"}
              }
             },
             "LoginResponse": {
               "type": "object",
               "properties": {
                 "token": {
                   "type": "string"
                 },
                 "sign": {
                   "type": "string"
                 },
                 "redirectUrl": {
                   "type": "string"
                 },
                 "created": {
                   "type": "string",
                   "format": "date-time"
                 }
               }
             }
           }
         }
       },
    apis: ["./routes/*.js"], 
};

// apis hace el llamado a todos los js ubicados en la carpeta routes

const swaggerSpecs = swaggerjsdoc(options);                //La api se llama en swaggerSpecs PAra posteriormente ponerle un "apodo" a la url
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpecs));        //Esta funcion hace que la url termine en /api-docs

