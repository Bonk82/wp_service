import postgres from 'pg';
import * as glb from '../globals.js'


const configSeguridad = {
  host: glb.seguridad_host,
  user: glb.seguridad_user,
  database: glb.seguridad_db,
  password: glb.seguridad_pwd,
  port: glb.seguridad_port,
  max: 20, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 5000,
};

const configNegocio ={
  host: glb.negocio_host,
  user: glb.negocio_user,
  database: glb.negocio_db,
  password: glb.negocio_pwd,
  port: glb.negocio_port,
  max: 20, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 5000,
};
 
export const obtenerDatos = async (consulta,conexion) =>{
  return new Promise(async (resolve, reject) => {
    let pool;
    if(conexion == 'negocio') pool = new postgres.Pool(configNegocio);
    if(conexion == 'seguridad') pool = new postgres.Pool(configSeguridad);
    console.log('accediendo a datos',consulta,conexion);
    try {
      const client = await pool.connect();
      //console.log('con conexion',client);
      const data = await client.query(consulta);
      resolve(data);
    } catch (error) {
      reject(error)
    }
  })
}