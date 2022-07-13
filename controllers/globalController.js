const axios = require('axios');
const {db} = require('./bdConnection');
//const moment = require('moment');
//const jwt = require('jwt-simple');
//var fs = require('fs');
const jwtDecode = require('jwt-decode');

// Una funcion async va a esperar que pase todos los pasos internos para poder dar una respuesta

const loginClient = async (req,res) => {
    try {
        var data = JSON.stringify({
            "successUrl": `http://localhost:${process.env.PORT || 4000}/GRUPO-J/success`,
            "failedUrl": `http://localhost:${process.env.PORT || 4000}/GRUPO-J/failed`
          });
          
          var config = {
            method: 'post',
            url: 'https://api.sebastian.cl/UtemAuth/v1/tokens/request',
            headers: { 
              'X-API-TOKEN': 'CPYD-J-202201', 
              'X-API-KEY': '9b4d541444094aac941bd70b8ecce78d', 
              'Content-Type': 'application/json'
            },
            data : data
          };
          
          axios(config)
          .then(function (response) {
            res.status(200).json(response.data);
          })
          .catch(function (error) {
            res.status(400).json(error);
          });
    } catch (error) {
        res.status(400).json(error);
    }
}

const GetAssistance = async (req,res) => {
    try {
        var assistance = await db.query('SELECT * FROM assistance where entrada IS NOT NULL AND salida IS NOT NULL');
        res.status(200).json(assistance.rows);
    } catch (error) {
        res.status(400).json(error);
    }
}

const EnterOutput = async (req,res) => {
  try {
    if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
      const userToken = req.headers['jwt'];
      let payload = {};
      payload = jwtDecode(userToken);
      var queryEstudiante = await db.query('SELECT * FROM estudent where email=$1',[payload.email])
      if (queryEstudiante['rows'].length > 0) {
        var querySeccion = await db.query('SELECT * FROM section where nombre=$1',[req.body.subject]);
        if (querySeccion['rows'].length > 0) {
          var queryCurso = await db.query('SELECT * FROM course where id_estudent=$1 AND id_section=$2',[queryEstudiante['rows'][0]['id'],querySeccion['rows'][0]['id']])
          if (queryCurso['rows'].length > 0) {
            var queryEntrada = await db.query('SELECT * FROM assistance where email=$1 AND entrada=$2 AND section=$3 AND sala=$4',[payload.email,req.body.entrance,req.body.subject,req.body.classroom]);

            if (queryEntrada['rows'].length > 0) {
              await db.query('UPDATE assistance SET salida=$1 WHERE id=$2',[req.body.leaving,queryEntrada['rows'][0]['id']]);
              res.status(200).json({
                "classroom" : req.body.classroom,
                "subject" : req.body.subject,
                "entrance" : req.body.entrance,
                "leaving" : req.body.leaving
              });
            } else {
              res.status(400).json('Usted no hizo ingreso a la sala en la fecha indicada');
            }
            
          } else {
            res.status(400).json('No existe este estudent en esta seccion');
          }
        } else {
          res.status(400).json('No existe la sección');
        }
      }else{
        res.status(400).json('No existe el estudiante');
      }
    } else {
      res.status(400).json('Debe ingresar los parametros classrom, subject y entrance');
    }
  } catch (error) {
    res.status(400).json(error);
  }
}

const EnterAssistance = async (req,res) => {
  try {
    if (req.body.classroom != null && req.body.subject != null && req.body.entrance !=null) {
      const userToken = req.headers['jwt'];
      let payload = {};
      payload = jwtDecode(userToken);
      var queryEstudiante = await db.query('SELECT * FROM estudent where email=$1',[payload.email])
      if (queryEstudiante['rows'].length > 0) {
        var querySeccion = await db.query('SELECT * FROM section where nombre=$1',[req.body.subject]);
        if (querySeccion['rows'].length > 0) {
          var queryCurso = await db.query('SELECT * FROM course where id_estudent=$1 AND id_section=$2',[queryEstudiante['rows'][0]['id'],querySeccion['rows'][0]['id']])
          if (queryCurso['rows'].length > 0) {
           await db.query('INSERT INTO assistance(email,sala,section,entrada) VALUES($1,$2,$3,$4)',[payload.email,req.body.classroom,req.body.subject,req.body.entrance]);
            res.status(200).json({
              "classroom" : req.body.classroom,
              "subject" : req.body.subject,
              "entrance" : req.body.entrance,
              "email" : payload.email
            });
          } else {
            res.status(400).json('No existe este estudiante en esta sección');
          }
        } else {
          res.status(400).json('No existe la sección');
        }
      }else{
        res.status(400).json('No existe el estudiante');
      }
    } else {
      res.status(400).json('Debe ingresar los parametros classrom, subject y entrance');
    }
  } catch (error) {
    res.status(400).json(error);
  }
}
// exportacion de funciones para realizar ciertos llamados
module.exports = {
    loginClient,
    GetAssistance,
    EnterAssistance,
    EnterOutput
}