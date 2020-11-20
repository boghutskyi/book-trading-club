const { Router } = require('express')
const Book = require('../models/Book')
const User = require('../models/User')
const Request = require('../models/Request')
const auth = require('../middleware/auth.middleware')

const router = Router()

router.post('/add', auth, async (req, res) => {
    try {
        const { title, subtitle } = req.body
        const candidate = await Book.findOne({ title })

        if (candidate) {
            return res.status(400).json({ message: 'Book already exist' })
        }
        const book = new Book({
            title,
            subtitle,
            owner: req.user.userId
        })
        await book.save()
        await User.findOneAndUpdate({ _id: req.user.userId }, { $push: { books: book } })

        res.status(200).json({ message: 'Book added' })

    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/delete', auth, async (req, res) => {
    try {
        const bookId = req.body.bookId
        const book = await Book.findOne({ _id: bookId })

        if (!book) {
            return res.status(400).json({ message: 'Book does not exist' })
        }
        await Book.deleteOne({ _id: bookId })
        await User.updateOne({ books: bookId }, { $pull: { books: bookId } })
        const give = await Request.find({ give: bookId }, { _id: 1 })
        const take = await Request.find({ take: bookId }, { _id: 1 })
        console.log(give)
        console.log(take)

        for (const item of give) {
            await Book.updateMany({ requests: item._id }, { $pull: { requests: item._id } }, { multi: true })
            await User.updateOne({ requests: item._id }, { $pull: { requests: item._id } })
            await User.updateOne({ trades: item._id }, { $pull: { trades: item._id } })
        }

        for (const item of take) {
            await Book.updateMany({ requests: item._id }, { $pull: { requests: item._id } }, { multi: true })
            await User.updateOne({ requests: item._id }, { $pull: { requests: item._id } })
            await User.updateOne({ trades: item._id }, { $pull: { trades: item._id } })
        }
        await Request.deleteMany({ give: bookId })
        await Request.deleteMany({ take: bookId })

        res.status(200).json({ message: 'Book was deleted' })
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/findgive', auth, async (req, res) => {
    try {
        const data = req.body
        const request = new Request({
            ...data
        })
        res.json(request)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.post('/newrequest', auth, async (req, res) => {
    try {
        const userId = req.body.userId
        const data = await Book.find({ owner: { $not: { $eq: userId } } }).populate('owner').populate({ path: 'requests', populate: { path: 'from' } })
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/books', async (req, res) => {
    try {
        const books = await Book.find({}).populate('owner').populate({ path: 'requests', populate: { path: 'from' } })
        res.json(books)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/books/:id', async (req, res) => {
    try {
        const userId = req.params.id
        const books = await Book.find({ owner: userId }).populate('owner').populate({ path: 'requests', populate: { path: 'from' } })
        res.json(books)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})

router.get('/books/req/:id', async (req, res) => {
    try {
        const bookId = req.params.id
        const data = await Book.findOne({_id: bookId}).populate({ path: 'requests', populate: ['from', 'to' , 'give', 'take'] })
        res.json(data)
    } catch (e) {
        res.status(400).json({ message: 'Something went wrong' })
    }
})


module.exports = router