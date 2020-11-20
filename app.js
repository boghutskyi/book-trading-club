const express = require('express')
const mongoose = require('mongoose')
const config = require('config')

const app = express()

app.use(express.json({extended: true}));

const PORT = config.get('port') || 5000

app.use('/api/auth', require('./routes/auth.routes'))
app.use('/api/book', require('./routes/book.routes'))
app.use('/api/users', require('./routes/users.routes'))
app.use('/api/request', require('./routes/request.routes'))

async function start() {
    try {
        mongoose.connect(config.get('mongoUri'), {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            useCreateIndex: true 
        })
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (e) {
        console.log('Server error', e.message)
        process.exit(1)
    }
}

start()
