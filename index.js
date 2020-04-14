const express = require('express')
require('./mongose')
const User = require('./models/user')
const auth = require('../src/middleware/auth')
const Task = require('./models/task')
var otpGenerator = require('otp-generator')
const generateOtp= require('../src/email/accn')

const app = express()
const port = process.env.PORT || 3000
var date=Date.now()
console.log(date)
var date1=new Date()
console.log(date1)
var month=date1.getMonth()
console.log(month)
app.use(express.json())
const multer = require('multer')
const upload = multer({
    limits: {
        fileSize: 100000000
    },
    fileFilter(req, file, cb) {
        if (!file.originalname.endsWith('.jpg')) {
            return cb(new Error('Please upload an image'))
        }

        cb(undefined, true)
    }
})

app.post('/users/me/avatar', auth, upload.single('upload'), async (req, res) => {
    req.user.avatar = req.file.buffer
    await req.user.save()
    res.send()
}, (error, req, res, next) => {
    res.status(400).send({ error: error.message })
})

app.delete('/users/me/avatar', auth, async (req, res) => {
    req.user.avatar = undefined
    await req.user.save()
    res.send()
})
app.get('/users/:id/avatar', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)

        if (!user || !user.avatar) {
            throw new Error()
        }

        res.set('Content-Type', 'image/jpg')
        res.send(user.avatar)
    } catch (e) {
        res.status(404).send()
    }
})


app.post('/users', async (req, res) => {
    const user = new User(req.body)
    const email=req.body.email
    generateOtp(email);


    try {
        await user.save()
        const token = await user.generateAuthToken()
        res.status(201).send({ user, token })

    } catch (e) {
        res.status(400).send(e)
    }
})

app.post('/users/login', async (req, res) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()
        res.send({ user , token })
    } catch (e) {
        res.status(400).send()
    }
})
app.post('/users/logout', auth, async (req, res) => {
    try {
        req.user.tokens = req.user.tokens.filter((token) => {
            return token.token !== req.token
        })
        await req.user.save()

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})
app.get('/users/me',auth, async (req, res) => {
    res.send(req.user)  
})


app.listen(port, () => {
    console.log('Server is up on port ' + port)
})

