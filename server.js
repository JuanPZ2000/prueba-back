import express from 'express'
import cors from 'cors'
import btg from './api/btg.route.js'


const app = express()

app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

app.use("/api/btg", btg)
app.use("*", (req, res) => res.status(404).json({ error: "not found"}))

export default app