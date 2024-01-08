const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const Routes = require('./routes');


const SERVER = {};

const createServer = function() {
    const app = express();
    

    // SETTINGS
    app.set('appName', 'SERVIDOR-420');


    // MIDDLEWARES
    app.use(cors()); // Configurar cors para permitir solicitudes desde todos los orígenes
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(morgan('dev'));
    app.use(Routes); //ROUTES


    app.get('*', (req, res) => {
        res.end('No found');
    });
    
    return app; // Debes devolver el objeto app
}




SERVER.createServer = createServer;

module.exports = SERVER;
