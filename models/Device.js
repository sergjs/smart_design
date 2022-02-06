const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true },
    id: {type: String, required: true},
    about: {type: String, required: true},
    specifications1: {type: String, required: true},
    specifications2: {type: String, required: true},
    specifications3: {type: String, required: true},
    specifications4: {type: String, required: true},
})

module.exports = model('Device', schema)

