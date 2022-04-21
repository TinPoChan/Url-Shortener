require('dotenv').config()
const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const ShortUrl = require('./models/shortUrl')
const app = express();

app.use(cors())

mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error(err))

app.set('view engine', 'ejs')
app.use(express.urlencoded({ extended: false }))

app.get('/', async (req, res) => {
    const shortUrls = await ShortUrl.find()
    res.render('index', { shortUrls: shortUrls })
  })

app.post('/shortUrls', async (req, res) => {
    await ShortUrl.create({ full: req.body.fullUrl })
    res.redirect('/')
})

app.get('/:shortUrl', async (req, res) => {
    const shortUrl = await ShortUrl.findOne({ short: req.params.shortUrl })
    if (shortUrl == null) { res.send('Short URL not found') }
    shortUrl.clicks++
    shortUrl.save()

    res.redirect(shortUrl.full)
})
    

app.listen(process.env.PORT, () => {
    console.log('Server is running');
})