import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import { MongoClient } from 'mongodb'
import joi from 'joi'
import bcrypt from 'bcrypt'
import {v4 as uuidV4} from 'uuid'

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
const sessionsColl = db.collection("sessions")

//schemas
const signupSchema = joi.object({
    name: joi.string().required(),
    email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: joi.required(),
    confirmp: joi.required()
})

const signinSchema = joi.object({
    email: joi.string().email({ minDomainSegments: 2 }).lowercase().required(),
    password: joi.required(),
})

//routes
app.post('/sign-up', async (req, res) => {
    const {name, email, password, confirmp} = req.body

    const alreadyExists = await usersColl.findOne({email:email})

    if(alreadyExists){
        res.status(400).send("Email já cadastrado.")
        return
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

    const validation = signupSchema.validate(user, {abortEarly: false})

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

app.post('/', async (req, res) => {
    const {email, password} = req.body
    const token = uuidV4()

    const validation = signinSchema.validate(req.body, {abortEarly: false})

if(validation.error){
    const errors = validation.error.details.map( (detail)=> detail.message)
    res.status(422).send("Preencha os campos corretamente")
    console.log(errors)
    return
}


   const user = await usersColl.findOne({email})
   
   if(user && bcrypt.compareSync(password, user.password)){
    
    await sessionsColl.insertOne({
        token,
        userId: user._id
    })

    res.send({token})


   }else{
    res.status(401).send("Usuário ou senha incorretos.")
   }




})



app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}.`))

