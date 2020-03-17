const express = require('express')

const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const { OAuth2Client } = require('google-auth-library')
const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID)

const Badge = require('../models/badge')

const app = express()

app.post('/login', (req, res) => {
    let body = req.body

    Badge.findOne({ email: body.email }, (err, badgeDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!badgeDB) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect (username) or password' //FIXME: edit on production
                }
            })
        }

        if (!bcrypt.compareSync(body.password, badgeDB.password)) {
            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Incorrect username or (password)' //FIXME: edit on production
                }
            })
        }

        let token = jwt.sign(
            {
                badge: badgeDB
            },
            process.env.SEED,
            { expiresIn: process.env.EXPIRATION_AUTH }
        )

        res.json({
            ok: true,
            badge: badgeDB,
            token
        })
    })
})

// Google config ==>
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
        // Or, if multiple clients access the backend:
        //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    })
    const payload = ticket.getPayload()

    return {
        name: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}
// Google config <==

app.post('/google', async (req, res) => {
    let token = req.body.idtoken

    let googleUser = await verify(token).catch(e => {
        return res.status(403).json({
            ok: false,
            err: e
        })
    })

    Badge.findOne({ email: googleUser.email }, (err, badgeDB) => {
        if (err) {
            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (badgeDB) {
            if (badgeDB.google === false) {
                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'You are not registered with google'
                    }
                })
            } else {
                let token = jwt.sign(
                    {
                        badge: badgeDB
                    },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_AUTH }
                )

                return res.json({
                    ok: true,
                    badge: badgeDB,
                    token
                })
            }
        } else {
            /* If badge don't exist on database */
            let badge = new Badge()

            badge.name = googleUser.name
            badge.email = googleUser.email
            badge.img = googleUser.img
            badge.google = true
            badge.password = ':)'

            badge.save((err, badgeDB) => {
                if (err) {
                    return res.status(500).json({
                        ok: false,
                        err
                    })
                }

                let token = jwt.sign(
                    {
                        badge: badgeDB
                    },
                    process.env.SEED,
                    { expiresIn: process.env.EXPIRATION_AUTH }
                )

                return res.json({
                    ok: true,
                    badge: badgeDB,
                    token
                })
            })
        }
    })
})

module.exports = app
