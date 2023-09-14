import express from "express";
import { config } from "dotenv";
import cors from 'cors'
import morgan from "morgan";

//ROUTES
import serviciosRoutes from './routes/servicios.routes.js'

config();
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
app.listen(process.env.PORT,()=> console.log(`Corriendo en el puerto ${process.env.PORT}`) )