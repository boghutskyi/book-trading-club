const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    title: {type: String, required: true},
    subtitle: {type: String},
    owner: {type: Types.ObjectId, ref: 'User'},
    requests: [{type: Types.ObjectId, ref: 'Request'}]
})

module.exports = model('Book', schema)