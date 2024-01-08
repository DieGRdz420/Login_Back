const config = require('./config.js');

const scriptServer = require('./script.js');
// console.log('Módulo importado:', scriptServer);


const PORT = config.app.port;

const server = scriptServer.createServer(); // Aquí obtienes la instancia del servidor
const appName = server.get('appName'); // Obtener el valor de appName


server.listen(PORT, () => {
    console.log('Puerto: ', PORT);
    console.log('Aplicacion: ', appName);
});




