const jwt = require('jsonwebtoken');
const config = require('../config');

const SECRET = config.jwt.secret;



function asignarTOKEN(data) {
    return jwt.sign(data, SECRET)
};

function verificarToken(token) {
    try {
        const decodificado = jwt.verify(token, SECRET);

        return decodificado;
    } catch (error) {
        return null;
    }
};




const checkToken = {
    confirmarToken: function (req) { return verificarToken(req) }
};

module.exports = {
    asignarTOKEN,
    checkToken
};