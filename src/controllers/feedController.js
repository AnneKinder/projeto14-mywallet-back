import { sessionsColl, movementsColl, usersColl } from "../index.js"

export async function getFeed (req, res) {
    const {authorization} = req.headers
    const token = authorization?.replace("Bearer ", "")

    if(!token){
        res.sendStatus(500)
        return
    }  

    const session = await sessionsColl.findOne({token})
    console.log(session)
    if(!session){
        res.sendStatus(401)
        return
    }

    const userId = session.userId
    const user = await usersColl.findOne({_id: userId})
   
    
    if(!user){
        res.sendStatus(404)
        return
    }

    const userEmail = user.email


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

    

    const movesArray = await movementsColl.find({email: userEmail}).toArray()
    if(movesArray){
        res.send([movesArray, saldo])
    }else{
    res.sendStatus(401)
    }



}