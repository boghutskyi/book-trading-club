const {Router} = require('express')
const Book = require('../models/Book')
const User = require('../models/User')
const auth = require('../middleware/auth.middleware')
const router = Router()

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
        res.json(user)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/save', auth, async (req, res) => {
    try {
        const update = {
            name: req.body.name, city: req.body.city, state: req.body.state
        }
        const user = await User.findOneAndUpdate({_id: req.body._id} , update)
        res.status(200).json({user, message: 'User updated'})
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/', async (req, res) => {
    try {
        const data = await User.find({ })
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

module.exports = router