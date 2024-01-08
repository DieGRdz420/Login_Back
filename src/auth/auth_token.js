
const auth = require('./index');
const RESPUESTA = require('../red/respuestas');


module.exports = function authToken(req, res) {
    
    function middleware(req, res, next) {
        const authorizationHeader = req.headers['authorization'];

        if (authorizationHeader && authorizationHeader.startsWith('Bearer ')) {
            const token = authorizationHeader.slice(7); // Obtener el token excluyendo el prefijo 'Bearer '
            
            let respuesta = auth.checkToken.confirmarToken(token);

            if(respuesta != null) {
                RESPUESTA.success(req, res, { 'Autenticado': true }, 200); 
            } else {
                RESPUESTA.error(req, res, { 'Autenticado': false }, 401);
            }
        } else {
            RESPUESTA.error(req, res, 'Error al mandar el Token', 500);
        }
    };

    return middleware(req, res);
};