import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import joi from 'joi'
import bcrypt from 'bcrypt'

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

//schemas
const userSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: joi.required(),
    confirmp: joi.required()
})

//routes
app.post('/sign-up', async (req, res) => {
    const {name, email, password, confirmp} = req.body

    const alreadyExists = await usersColl.findOne({email:email})

    if(alreadyExists){
        res.send(alreadyExists)
    }


    if(password != confirmp){
        res.status(400).send("As senhas não conferem!")
        return
    }

    const passwordHash = bcrypt.hashSync(password, 10)

    const user = {
        name: name,
        email: email,
        password: passwordHash,
        confirmp: passwordHash

    }

    const validation = userSchema.validate(user, {abortEarly: false})

    if(validation.error){
        const errors = validation.error.details.map( (detail)=> detail.message)
        res.status(422).send("Preencha os campos corretamente")
        console.log(errors)
        return
    }



    try{
        await usersColl.insertOne({
            name: user.name,
            email:user.email,
            password:user.password
        })
        res.status(201).send("Created")
    }
    catch(err){
        console.log(err)
    }
    
})


app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}.`))

