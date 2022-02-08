const express = require('express')
const config = require('config')
const mongoose = require('mongoose')

const app = express()
app.use(express.json({extended:true}))
app.use('/api/', require('./routes/routes'))
const PORT = config.get('port') 

async function start(){
    try {
        await mongoose.connect(config.get('mongoUrl'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        })
        app.listen(PORT, () => console.log(`App has been started on port ${PORT}...`)) 
    } catch(e){
        process.exit(1)
    }
} 

start()