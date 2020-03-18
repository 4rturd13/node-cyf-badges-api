const express = require('express')

const app = express()

app.use(require('./badge'))
app.use(require('./login'))
app.use(require('./upload'))
app.use(require('./images'))
app.use(require('./uploadAws'))

module.exports = app
