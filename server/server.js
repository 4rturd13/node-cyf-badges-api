require('dotenv').config()
require('./config/config')

const express = require('express')
const mongoose = require('mongoose')
const path = require('path')

mongoose.set('useNewUrlParser', true)
mongoose.set('useCreateIndex', true)
mongoose.set('useFindAndModify', false)
mongoose.set('useUnifiedTopology', true)

const app = express()

const port = process.env.PORT || 3000

const bodyParser = require('body-parser')

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))

// parse application/json
app.use(bodyParser.json())

// enable public folder
app.use(express.static(path.resolve(__dirname, '../public')))

// Global routes config
app.use(require('./routes/index'))

mongoose.connect(process.env.URLDB)

app.listen(port, () => {
    console.log('Listening on port:', port)
})
