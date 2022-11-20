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

    const moveArray = await movementsColl.find()
    if(moveArray){
        res.send(moveArray)
    }else{
    res.sendStatus(401)
    }



}