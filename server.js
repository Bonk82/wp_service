import express from "express";
import { config } from "dotenv";
import cors from 'cors'
import morgan from "morgan";

//ROUTES
import wpRoutes from './routes/wp.routes.js'

config();
const app = express();

//MIDDLEWARE
app.use(morgan('dev'));
app.use(cors());
app.use(express.json());

//ROUTES
app.use(wpRoutes);
//app.use('/',wpRoutes);
//app.get('/ver',(req,res)=> res.send('hola'))

//SERVIDOR WEB
app.listen(process.env.PORT,()=> console.log(`Corriendo en el puerto ${process.env.PORT}`) )