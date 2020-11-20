const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    name: {type: String, required: true},
    email: {type: String, required: true, unique: true},
    password: {type: String, required: true},
    city: {type: String},
    state: {type: String},
    books: [ {type: Types.ObjectId, ref: 'Book' }],
    requests: [{type: Types.ObjectId, ref: 'Request'}],
    trades: [{type: Types.ObjectId, ref: 'Request'}]
})

module.exports = model('User', schema)