import dotenv from 'dotenv'
import dbConnection from "./db/database.js";

dotenv.config({
    path:'./env'
})

dbConnection()



