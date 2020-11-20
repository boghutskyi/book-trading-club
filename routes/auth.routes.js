const { Router } = require('express')
const jwt = require('jsonwebtoken')
const config = require('config')
const bcrypt = require('bcryptjs')
const {check, validationResult} = require('express-validator')
const User = require('../models/User')

const router = Router()

router.post(
    '/register',
    [
        check('name', 'Uncorrected name').isString(),
        check('email', 'Uncorrected email').isEmail(),
        check('password', 'Minimum length is 6').isLength({ min: 6 })
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Incorrect input fields'
                })
            }

            const { name, email, password } = req.body

            const candidate = await User.findOne({ email })

            if (candidate) {
                return res.status(400).json({ message: 'User already exist' })
            }

            const hashedPassword = await bcrypt.hash(password, 12)
            const user = new User({
                name: name,
                email: email,
                password: hashedPassword
            })
            await user.save()

            res.status(200).json({ message: 'User created' })

        } catch (e) {
            res.status(400).json({ message: 'Something went wrong' })
        }
    })


router.post(
    '/login',
    [
        check('email', 'Enter correct email').normalizeEmail().isEmail(),
        check('password', 'Enter password').exists()
    ],
    async (req, res) => {
        try {
            const errors = validationResult(req)

            if (!errors.isEmpty()) {
                return res.status(400).json({
                    errors: errors.array(),
                    message: 'Uncorrected fields in login'
                })
            }
            const { email, password } = req.body

            const user = await User.findOne({ email })

            if (!user) {
                return res.status(400).json({ message: 'Incorrected email of password' })
            }
            const isMatch = await bcrypt.compare(password, user.password)

            if (!isMatch) {
                return res.status(400).json({ message: 'Incorrected email of password1' })
            }

            const token = jwt.sign(
                { userId: user.id },
                config.get('jwtSecret'),
                { expiresIn: '1hr' }
            )

            res.json({
                token,
                userId: user.id,
                name: user.name
            })

        } catch (e) {
            res.status(400).json({ message: 'Something went wrong' })
        }
    })

module.exports = router
