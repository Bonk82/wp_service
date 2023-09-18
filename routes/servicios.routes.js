import { Router } from "express";
import * as wp from '../controllers/servicioWhatsapp.js'
import * as correo from '../controllers/servicioCorreo.js'
import * as interop from '../controllers/interopAgetic.js'

const router = Router();

/****whatsapp */
router.get('/wp/iniciar',wp.inciar);
router.get('/wp/conectar',wp.conectar);
router.post('/wp/enviarMensaje',wp.enviarMensaje);
router.get('/wp/verificacionServicio',wp.verificacionServicio);
router.get('/wp/detenerServicioWP',wp.detenerServicioWP);
// router.get('/wp/mensajesRecibidos',svc.mensajesRecibidos);

/*****correo */
router.post('/correo/enviarCorreo',correo.enviarCorreo);

/*******data access */
router.get('/seguridad/listarUsuarios',correo.listarUsuarios);

/*******interoperabilidad */
router.post('/interop/consumirInterop',interop.consumirInterop);

export default router;