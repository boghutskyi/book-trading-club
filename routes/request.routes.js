const { Router } = require('express')
const auth = require('../middleware/auth.middleware')
const Book = require('../models/Book')
const User = require('../models/User')
const Request = require('../models/Request')
const { body } = require('express-validator')

const router = Router()

router.post('/create', auth, async (req, res) => {
    try {
        const form = req.body
        if (!form.give.length || !form.take.length) {
            return res.status(400).json({ message: 'Can not create a request' })
        }
        const request = new Request({
            ...form
        })
        await request.save()
        form.take.forEach(async (item) => {
            await Book.findOneAndUpdate({ _id: item }, { $push: { requests: request._id } })
        })
        await User.findOneAndUpdate({ _id: request.from }, { $push: { requests: request._id } })
        await User.findOneAndUpdate({ _id: request.to }, { $push: { trades: request._id } })

        res.status(200).json({ message: 'Request saved' })
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/new', auth, async (req, res) => {
    try {
        const form = req.body
        const request = new Request({
            ...form
        })
        await request.save()
        const data = await Request.find({ _id: request._id }).populate('from').populate('to').populate('give').populate('take')
        res.json(data)


    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/update', auth, async (req, res) => {
    try {
        const form = req.body
        await Request.findOneAndUpdate({ _id: form.requestId }, { take: form.take, to: form.to })
        res.status(200).json({ message: 'Request successfully updated' })
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/cancel/:id', auth, async (req, res) => {
    try {
        const requestId = req.params.id
        await Request.deleteOne({ _id: requestId })
        await Book.updateMany({ requests: requestId }, { $pull: { requests: requestId } }, { multi: true })
        await User.updateOne({ requests: requestId }, { $pull: { requests: requestId } })
        await User.updateOne({ trades: requestId }, { $pull: { trades: requestId } })
        res.status(200).json({ message: 'Request deleted' })
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/', async (req, res) => {
    try {
        const data = await Request.find({}).populate('from').populate('to').populate('give').populate('take')
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/trades/:id', auth, async(req, res) => {
    try {
        const userId = req.params.id
        const data = await Request.find({ to: userId}).populate('from').populate('to').populate('give').populate('take')
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/:requestId', async (req, res) => {
    try {
        console.log(req.params.requestId)
        const data = await Request.findOne({ _id: req.params.requestId }).populate('from').populate('to').populate('give').populate('take')
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

module.exports = router
