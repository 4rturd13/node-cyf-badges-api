const express = require('express')
const app = express()

const axios = require('axios')

const clientID = process.env.GITHUB_CLIENT_ID
const clientSecret = process.env.GITHUB_CLIENT_SECRET

app.get('/sign-github', (req, res) => {
    const requestToken = req.query.code

    axios({
        method: 'post',
        url: `https://github.com/login/oauth/access_token?client_id=${clientID}&client_secret=${clientSecret}&code=${requestToken}`,
        headers: {
            accept: 'application/json'
        }
    }).then(response => {
        const accesToken = response.data.access_token
        console.log(response.data)

        res.redirect(`/sign-github?access_token=${accesToken}`)
    })
})

app.use(express.static(__dirname + '/public'))
