import express from "express";
import cors from 'cors'
import morgan from "morgan";
import * as glb from './globals.js'

//ROUTES
import serviciosRoutes from './routes/servicios.routes.js'

const app = express();

//MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//ROUTES
app.use(serviciosRoutes);
//app.use('/',wpRoutes);
//app.get('/ver',(req,res)=> res.send('hola'))

//SERVIDOR WEB
app.listen(glb.PORT,()=> console.log(`Corriendo en el puerto ${glb.PORT}`) )