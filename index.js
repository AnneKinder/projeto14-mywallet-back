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

//globals
const usersColl = db.collection("users")


app.post('/sign-up', async (req, res) => {
    const {name, email, password, confirmp} = req.body


    if(password != confirmp){
        res.status(501).send("As senhas não conferem!")
        return
    }


    const user = {
        name: name,
        email: email,
        password: password
    }

    try{
        await usersColl.insertOne({user})
        res.status(201).send("Created")
    }
    catch(err){
        console.log(err)
    }
    
})


app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}.`))

