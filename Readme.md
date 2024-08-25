/* First Approach to Connect With the DataBase

import express from "express";

const app= express();

(async()=>{
    try {
        await mongoose.connect(`${process.env.MONGODB_URL}/${DataBaseName}`);
        app.on('error',(error)=>{
            console.log("Error : Could not Connect to MongoDB", error);
            throw error;
        });
        
        app.listen(process.env.PORT,()=>{
            console.log(`App is Running On this Port -> ${process.env.PORT}`);
            
        })
    } catch (error) {
        console.log('Error',error);
        throw error;
    }
})()
*/