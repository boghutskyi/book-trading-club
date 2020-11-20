const {Schema, model, Types} = require('mongoose')

const schema = new Schema({
    give: [{type: Types.ObjectId, ref: 'Book'}],
    take: [{type: Types.ObjectId, ref: 'Book'}],
    from: {type: Types.ObjectId, ref: 'User'},
    to: {type: Types.ObjectId, ref: 'User'}
})

module.exports = model('Request', schema)