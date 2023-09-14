import qrcode from 'qrcode-terminal'
import wp from 'whatsapp-web.js'
import * as glb from "../globals.js";

let {cliente_wp} = glb;
const {Client,LocalAuth} = wp;

export const inciar = async(req,res)=>{
  if(!cliente_wp){
    console.log('actu glb');
    cliente_wp = {aprobad0:true,edad:57}
  } 
  console.log('rev',process.env.CLIENTE_WP,cliente_wp);
  const {valor} = req.query
  try {
    console.log('ok');
    res.send(`<H1>OK route ${valor}</H1>`)
  } catch (error) {
    console.log('bad');
    res.status(500).json({message: 'Algo salio mal', data: []})
  }
}

export const conectar = async(req,res)=>{
  console.log('conectando servicio whatsapp');
  const {destino} = req.query
  try {
    const correcto = await revisarConexion(destino);
    console.log('estado',correcto);
    res.status(200).json({message: 'login correcto, servicio activo', data: []});
  } catch (error) {
    res.status(500).json({message: 'Error: '+error, data: []})
  }
}

const revisarConexion = async (destino)=>{
  return new Promise((resolve, reject) => {
    try {
      const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}
      });
      client.on('qr', qr => {
        qrcode.generate(qr, {small: true});
      });
      
      client.on('auth_failure', () => console.log('error al conectar whatsapp'))
  
      client.initialize();
  
      client.on('ready', () => {
        console.log('login correcto, servicio activo');
        client.sendMessage(`591${destino}@c.us`,`🚀 Servicio whatsapp UPRE iniciado\n${new Date().toLocaleString()}`);//59175241032
        cliente_wp = client;
        resolve(cliente_wp)
      });
    } catch (error) {
      reject({message:error})
    }
  });
}

export const enviarMensaje = async(req,res)=>{
  if(!cliente_wp) await revisarConexion(req.body.destino)
  const client = cliente_wp;
  // console.log('con cliente',client,cliente_wp);
  const {para,mensaje} = req.body;
  try {
    const estadoWP = await client.getState();
    console.log('enviando mensaje...',new Date().toLocaleString(),estadoWP);

    const numeros = para.split(',');
    numeros.forEach(el => {
      client.sendMessage(`591${el}@c.us`,mensaje);
    });
  
    client.on('message_create', (msg) => {
      if (msg.fromMe) {
        console.log(`Servicio UPRE mensaje enviado al numero:  ${msg.to.replace('591','+591 ').replace('@c.us','')},
        detalle:  ${msg.body}
        fecha: ${new Date().toLocaleString()}`);
      }
      res.status(200).json({message: `Servicio UPRE mensaje enviado al numero:  ${msg.to.replace('591','+591 ').replace('@c.us','')},
      detalle:  ${msg.body}
      fecha: ${new Date().toLocaleString()}`})
    });

    client.on('change_state',async ()=>{
      const estadoWP = await client.getState();
      if(estadoWP != 'CONNECTED') console.log('El servicio WP de desconecto',estadoWP,new Date().toLocaleString());
    })  
  } catch (error) {
    console.log('error enviarMensaje',error);
    res.status(500).json({message: 'Error:'+error, data: []})
  } finally{
    res.status(200).json({message: 'Mensajes enviados correctamente', data: []})
  }
}

export const verificacionServicio = async (req,res)=>{
  console.log('verificando estado mensajería',req);
  let resp=false;
  try {
    const client2 = global.cliente_wp;
    const estadoWP = await client2.getState();
    if(!fs.existsSync(path.resolve(__dirname, './.wwebjs_auth/session/Default/Session Storage'))){
      console.log('Directorio de session de whatsapp no encontrado, reinicie backEnd');
      resp=true;
      res.status(500).json({message: `Error servicio mensajería inactivo (sin sesión),vuelva a conectar`, data: []});
    }

    if(estadoWP=='CONNECTED'){
      console.log('sesion activa');
      client2.sendMessage(`591${req.destino}@c.us`,`✅ Servicio whatsapp UPRE verificado(activo)\n${new Date().toLocaleString()}`);
      resp=true;
      res.status(200).json({message: `Servicio mensajería verificado(activo) correctamente al número ${req.destino}`, data: []});
    }else{
      console.log('servicio anactivo');
      const client = new Client({
        authStrategy: new LocalAuth(),
        puppeteer: {headless: true, args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-extensions']}
      });
  
      client.on('ready',() => {
        console.log('sesion iniciada correctamente');
        client.sendMessage(`591${req.destino}@c.us`,`✅ Servicio whatsapp UPRE verificado(reiniciado)\n${new Date().toLocaleString()}`);
        resp=true;
        res.status(200).json({message: `Servicio mensajería verificado(reiniciado) correctamente al número ${req.destino}`, data: []});
        cliente_wp = client;
        clearTimeout(timerFinal);
      });
  
      const timerFinal = setTimeout(() => {
        if(!resp) res.status(500).json({message: 'Error servicio mensajería inactivo,vuelva a conectar, '+error, data: []});
      }, 50000);
  
      client.on('auth_failure', () => res.status(500).json({message: 'Error servicio mensajería inactivo,vuelva a conectar, '+error, data: []}))
      client.initialize();
    }
  } catch (error) {
    console.log('Error verificacionServicio',error);
    res.status(500).json({message: 'Error servicio mensajería inactivo,vuelva a conectar, '+error, data: []});
  }
}

export const detenerServicioWP = async (req,res)=>{
  console.log('deteniendo servicio',req.query);
  try {
    const cliente = cliente_wp;
    const estado = await cliente.getState() 
    await cliente.destroy();
    cliente_wp = cliente;
    res.status(200).json({message: `Servicio mensajería detenido satisfactoriamente!`, data: []});
  } catch (error) {
    res.status(500).json({message: 'Error: '+error, data: []})
  }
  
}

export const mensajesRecibidos = async (req,res)=>{
  console.log('escuchando mensajes',req.query);
  const client = cliente_wp;
  try {
    client.on('message', message => {
      console.log(message);
      console.log(message.body);
      res.status(200).json({message: 'Mensaje recibido: '+message.body , data: []});
    });
  } catch (error) {
    console.log('Error mensajesRecibidos',error);
    res.status(500).json({message: 'Error mensajesRecibidos, '+error, data: []});
  }
}