import mongoose from "mongoose";
import { DataBaseName } from "../constants.js";

const dbConnection= async ()=>{
    try {

        const gotConnected = await mongoose.connect(`${process.env.MONGODB_URL}/${DataBaseName}`);
        console.log(`Successfully connected to MongoDB !!! ${gotConnected.connection.host}`);

    } catch (error) {
        console.log('Unavailable to Connect With MongoDB',error);
        process.exit(1);
        
    }
}


export default dbConnection;