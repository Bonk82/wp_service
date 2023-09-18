import axios from 'axios'
import * as glb from '../globals.js'

export const consumirInterop = async (req, res)=>{
  console.log('consumir interop',req.body);
  const {principal,ruta,llave_token,puerto,metodo,cuerpo} = req.body;

  const bd = typeof cuerpo == 'object' ? JSON.parse(cuerpo) : "";

  try {
    const headers = {
      "Content-Type": "application/json",
      "Authorization":llave_token || glb.tokenIO,
    };
    const options = {
      method: metodo || 'GET',
      baseURL:principal || glb.urlInterop,
      port:puerto || 443,
      url:ruta,
      headers:headers,
    }
    if(metodo=='POST') options.data = bd;
  //   console.log('mandando',options,headers,JSON.parse(cuerpo));
    const resp = await axios(options)
    console.log('la respuesta',resp);
    res.status(200).json({message: 'Consumo exitoso', data: [resp.data]});
  } catch (error) {
    res.status(500).json({message: 'Error servicioInterop, ' + error, data: []});
  }
}