const DB = require('../db/mysql');
const RESPUESTA = require('../red/respuestas');

const validator = require('validator');


const USUARIOS = {};


const LOGIN_usuario = async function(req, res) {
    if (typeof req.body.email === 'string' && typeof req.body.contrasena === 'string') {
        const email = validator.escape(req.body.email);
        const contrasena = validator.escape(req.body.contrasena);
        
        try {
            // console.log('LOGIN_usuario: ', req.body);
            var JSON = await DB.USUARIO('usuarios', email, contrasena);
                
            RESPUESTA.success(req, res, JSON, 200); 
        } catch (error) {
            RESPUESTA.error(req, res, error.toString(), 500);
        }
    } else {
      RESPUESTA.error(req, res, 'Datos de usuario no válidos', 400);
    }
}

const GET_usuarios = async function(req, res) {
    try {
        var JSON = await DB.TODOS('usuarios');

        RESPUESTA.success(req, res, JSON, 200);
    } catch (error) {
        // console.error('Error al obtener clientes:', error);
        RESPUESTA.error(req, res, 'Error interno del servidor', 500);
    }
}

const GET_roles = async function(req, res) {
    try {
        var JSON = await DB.TODOS('roles');

        RESPUESTA.success(req, res, JSON, 200);
    } catch (error) {
        // console.error('Error al obtener clientes:', error);
        RESPUESTA.error(req, res, 'Error interno del servidor', 500);
    }
}

const POST_usuario = async function(req, res) {
    try {
        if(req.body.email && req.body.contrasena) {
            var USUARIO_DATA = await DB.USUARIO('usuarios', req.body.email, req.body.contrasena);
            
            console.log('POST_usuario: ', USUARIO_DATA);
            if(USUARIO_DATA.length === 0) {

                var JSON = await DB.USUARIO_AGREGAR('usuarios', req.body);
                
                RESPUESTA.success(req, res, 'Usuario Agregado', 200);
            } else {
                // console.log("Usuario existente");
                RESPUESTA.error(req, res, "Usuario existente", 500);
                // var JSON = await DB.USUARIO_ACTUALIZAR('usuarios', req.body, USUARIO_DATA[0]['id']);
                
                // RESPUESTA.success(req, res, 'Usuario Actualizado', 200);
            }
        } else {
            RESPUESTA.error(req, res, 'Error de Usuario', 500);
        }
    } catch (error) {
        // console.error('Error al obtener clientes:', error);
        RESPUESTA.error(req, res, 'Error interno del servidor', 500);
    }
}

const DELETE_usuario = async function(req, res, id) {
    try {
        var JSON = await DB.ELIMINAR('usuarios', id);
        
        RESPUESTA.success(req, res, 'Usuario eliminado', 200);
    } catch (error) {
        // console.error('Error al obtener clientes:', error);
        RESPUESTA.error(req, res, 'Error interno del servidor', 500);
    }
}

USUARIOS.GET_usuarios = GET_usuarios;
USUARIOS.GET_roles = GET_roles;
USUARIOS.LOGIN_usuario = LOGIN_usuario;
USUARIOS.POST_usuario = POST_usuario;
USUARIOS.DELETE_usuario = DELETE_usuario;

module.exports = USUARIOS;
