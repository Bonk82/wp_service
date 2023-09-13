import { Router } from "express";
import * as svc from '../controllers/servicioWhatsapp.js'

const router = Router();

router.get('/wp/iniciar',svc.inciar);
router.get('/wp/conectar',svc.conectar);
router.post('/wp/enviarMensaje',svc.enviarMensaje);

export default router;