const express = require('express')
const config = require('config')
const mongoose = require('mongoose')
const corsMiddleware = require('./middleware/cors.middleware')

const app = express()
app.use(express.json({extended:true}))
app.use('/api/', require('./routes/routes'))
app.use(corsMiddleware);
const PORT = config.get('port') 

async function start(){
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) 
    } catch(e){
        console.log("server error", e.message)
        process.exit(1)
    }
} 

start()