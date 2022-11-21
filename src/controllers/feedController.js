import { sessionsColl, movementsColl } from "../index.js"

export async function getFeed (req, res) {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer", "")

    if(!token){
        res.sendStatus(500)
        return
    }  

    const session = await sessionsColl.find({token})

    if(!session){
        res.status(401).send(token)
        return
    }

    let entries = await movementsColl.find({"type": "entry"}).toArray()
    let exits = await movementsColl.find({"type": "exit"}).toArray()

    let saldo = 0
    entries.forEach((obj) => {
       saldo+= Number(obj.valor)
    })
    exits.forEach((obj) => {
        saldo-= Number(obj.valor)
     })
    console.log(saldo)

    

    const movesArray = await movementsColl.find().toArray()
    if(movesArray){
        res.send([movesArray, saldo])
    }else{
    res.sendStatus(401)
    }



}