import nm from 'nodemailer';
import * as da from './dataAccess.js'


export const enviarCorreo = async (req,res) =>{
  console.log('enviando mail:',req.body);
  const {servidor,puerto,usuario,clave,cuenta_origen,para,asunto,mensaje} = req.body;
  let info = null;
  try {
    let transporter = nm.createTransport({
      host: servidor,
      port: puerto,
      secureConnection: puerto == 465 ? true : false,
      auth: {
        user: usuario, 
        pass: clave,
      },
      tls: {
        ciphers:'SSLv3'
      }
    });

    const estado = await transporter.verify();
    console.log('estado de servicio correo',estado);

    const elCorreo = {
      from: cuenta_origen,
      to: para,
      subject: asunto,
      // text: "Cuerpo del mensaje", // se puede poner como texto plano tambien 
      html: mensaje  ||"<h1>Mensaje por Defecto</h1><p>El cuerpo del mensaje no fue proporcionado</p>", // html body
    }
  
    info = await transporter.sendMail(elCorreo);
    console.log('correo enviado',info);
    res.status(200).json({message: 'Correo enviado satisfactoriamente!', data: [info]});
  } catch (error) {
    console.log('Error enviarCorreo',error,info);
    res.status(500).json({message: 'Error enviarCorreo, ' + error, data: []});
  }
}

export const listarUsuarios = async (req,res) =>{
  console.log('listarUsuarios',req.query);
  try {
    const respuesta = await da.obtenerDatos('select * from seguridad.t_usuarios','seguridad');
    res.status(200).json({message: 'Consulta exitosa!!!', data: respuesta});
  } catch (error) {
    console.log('Error listarUsuarios',error);
    res.status(500).json({message: 'Error consulta: , ' + error, data: []});
  }
}


