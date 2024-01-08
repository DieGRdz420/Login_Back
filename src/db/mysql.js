const mysql = require('mysql');
const bcrypt = require('bcrypt');

const AUTH = require('../auth/index');


const config = require('../config');
const dbconfig = {
    host: config.mysql.host,
    user: config.mysql.user,
    password: config.mysql.password,
    database: config.mysql.database
};
let conexion;


function con_mysql() {
    conexion = mysql.createConnection(dbconfig);

    conexion.connect((err) => {
        if(err) {
            console.log('con_mysql: ', err);
            setTimeout(con_mysql, 200);
        } else {
            console.log('con_mysql: ', 'DB conectada');
        }
    });

    conexion.on('error', (err) => {
        if(err.code === 'PROTOCOL_CONNECTION_LOST') {
            con_mysql();
        } else {
            throw err;
        }
    });
};
con_mysql();

const TODOS = (tabla) => {
    return new Promise((resolve, reject) => {
        conexion.query(`
            SELECT ${tabla}.id, ${tabla}.nombre, ${tabla}.email, roles.rol
            FROM ${tabla}
            INNER JOIN roles ON ${tabla}.id_rol = roles.id
        `, (error, result) => {
            if (error) {
                return reject(error);
            } else {
                return resolve(result);
            };
        });
    });
};


const USUARIO = (tabla, email, contrasena) => {
    return new Promise(async (resolve, reject) => {
        const query = `
            SELECT usuarios.id, usuarios.nombre, usuarios.email, usuarios.contrasena, roles.rol
            FROM usuarios
            INNER JOIN roles ON usuarios.id_rol = roles.id
            WHERE usuarios.email = '${email}'
        `;


        conexion.query(query, (error, result) => {
            if(error) {
                // console.log("conexion error: ", error);
                return reject(error);
            } else {
                // console.log('USUARIO: ', result);

                if(result.length > 0) {
                    return bcrypt.compare(contrasena, result[0]['contrasena'])
                        .then(resultado => {
                            if (resultado) {
                                // console.log('La contraseña es válida');
                                var dataUsuario =  {
                                    "id": result[0]['id'],
                                    "usuario": result[0]['nombre'],
                                    "email": result[0]['email'],
                                    "rol_usuario": result[0]['rol'],
                                    "token": AUTH.asignarTOKEN({ ...resultado })
                                };
    
                                return resolve(dataUsuario);
                            } else {
                                throw new Error('Información Inválida');
                                // return reject('Información Inválida');
                            }
                        })
                        .catch(error => {
                            console.error('Error al comparar contraseñas:', error);
                            return reject(error);
                        });
                } else {
                    // console.log("conexion error2: ", result);
                    return resolve([]);
                };
            };
        });
    });
};

const USUARIO_AGREGAR = async (tabla, data) => {
    data.contrasena = await bcrypt.hash(data.contrasena.toString(), 5);
    
    return new Promise((resolve, reject) => {
        conexion.query(`INSERT INTO ${tabla} (nombre, email, contrasena, id_rol) 
                        VALUES ('${data.nombre}', '${data.email}', '${data.contrasena}', ${data.id_rol})`, (error, result) => {
            if(error) {
                return reject(error);
            } else {
                return resolve(result);
            };
        });
    });
};

const USUARIO_ACTUALIZAR = (tabla, data, id) => {
    return new Promise((resolve, reject) => {
        conexion.query(`UPDATE ${tabla}
                        SET nombre = '${data.nombre}', email = '${data.email}', contrasena = '${data.contrasena}', admin = ${data.admin}
                        WHERE id = ${id}`, (error, result) => {
            if(error) {
                return reject(error);
            } else {
                return resolve(result);
            };
        });
    });
};



const ELIMINAR = (tabla, id) => {
    return new Promise((resolve, reject) => {
        conexion.query(`DELETE FROM ${tabla} WHERE id = ${id}`, (error, result) => {
            if(error) {
                return reject(error);
            } else {
                return resolve(result);
            };
        });
    });
};



module.exports = {
    TODOS,
    USUARIO,
    USUARIO_AGREGAR,
    USUARIO_ACTUALIZAR,
    ELIMINAR
};