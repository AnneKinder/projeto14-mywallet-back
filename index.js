import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'


const app = express()
dotenv.config()
app.use(express.json())
app.use(cors())

app.listen(process.env.PORT, () => console.log(`Server running on port: ${process.env.PORT}.`))

