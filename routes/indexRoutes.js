const { Router } = require('express'); // este archivo ocupara el router de express
const express = require('express');
const app = express(); //la app express
const router = Router(); //ocupara router, ya declarada anteriormente
const middleware = require('../middleware/auth');

const {loginClient,GetAssistance,EnterAssistance, EnterOutput} = require('../controllers/globalController');
app.set('view engine','pug')    //Pug es utilizado para mostrar en jwt en html si el login es correcto
app.set('views','./view')   

router.get('/grupo-J/login', loginClient); //url a las que se debe llamar dependiendo de lo que uno necesite
router.get('/grupo-J/asistencias',middleware.checkToken, GetAssistance);
router.post('/grupo-J/getin',middleware.checkToken, EnterAssistance);
router.post('/grupo-J/getout',middleware.checkToken,EnterOutput);

router.get('/grupo-J/success',(req,res)=> {                         //funcion que despliega un html de pug con los datos del JWT y el token
    res.render('success',{jwt:`jwt:${req.query.jwt} token:${req.query.token}`})
}) 

app.use('/', router);

module.exports = app;