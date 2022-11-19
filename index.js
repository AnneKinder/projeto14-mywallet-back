import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'

//config:
const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

//mongo:
const mongoClient = new MongoClient(process.env.MONGO_URI)
try{
    await mongoClient.connect()
}
catch(err){
    console.log(err)
}

let db = mongoClient.db("wallet")



app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}.`))

