const moment = require('moment');
const jwtDecode = require('jwt-decode');
const checkToken = (req, res, next) => {

/**
 * Verifica si el jwt esta funcionando
 */
    if(!req.headers['jwt']) {
        return res.json({ error: 'Necesitas incluir el jwt en la cabecera' });
    }

    const userToken = req.headers['jwt'];
    let payload = {};

    try {
        payload = jwtDecode(userToken);
    } catch(err) {
        return res.json({ error: 'El token es incorrecto' });
    }

    if(payload.expiredAt < moment().unix()) {
        return res.json({ error: 'El Token ha expirado' });
    }

    req.usuarioId = payload.usuarioId;

    next();
}

module.exports = {
    checkToken: checkToken
}
