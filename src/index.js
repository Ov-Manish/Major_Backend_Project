import dotenv from 'dotenv'
import dbConnection from "./db/database.js";
import { app } from './app.js';

dotenv.config({
    path:'./env'
})

dbConnection()
.then(()=>{
    app.on('error',(error)=>{
        console.log('Connection Failed before Listen : ', error );
        throw error;
    })
    app.listen(process.env.PORT || 7000,()=>{
        console.log(`Server is running on this port : ${process.env.PORT}`);
        
    })
})
.catch((err)=>{
    console.log('MongoDB connection failed in Indexfile !!!',err);
    throw err;
})