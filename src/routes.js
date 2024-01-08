const express = require('express');
const router = express.Router();

// AUTENTICAR TOKEN
const authToken = require('./auth/auth_token');

// MODULOS
const USUARIOS = require('./modulos/usuarios');


// ROUTES
router.get('/api/usuarios', async (req, res) => {
    const usuariosData = await USUARIOS.GET_usuarios(req, res);

    if (typeof usuariosData === 'object') {
        res.json(usuariosData);
    };
});

router.get('/api/usuarios/roles', async (req, res) => {
    const rolesData = await USUARIOS.GET_roles(req, res);

    if (typeof rolesData === 'object') {
        res.json(rolesData);
    };
});

router.post('/api/login', async (req, res) => {
    const usuariosData = await USUARIOS.LOGIN_usuario(req, res);

    if (typeof usuariosData === 'object') {
        res.json(usuariosData);
    };
});

router.get('/api/auth', async (req, res) => {
    const isToken = await authToken(req, res);

    if (typeof isToken === 'object') {
        res.json(isToken);
    };
});

router.post('/api/login/post', async (req, res) => {
    const usuariosData = await USUARIOS.POST_usuario(req, res);

    if (typeof usuariosData === 'object') {
        res.json(usuariosData);
    };
});

router.put('/api/usuario/:id', async (req, res) => {
    const usuariosData = await USUARIOS.DELETE_usuario(req, res, req.params.id);

    if (typeof usuariosData === 'object') {
        res.json(usuariosData);
    };
});



module.exports = router;
