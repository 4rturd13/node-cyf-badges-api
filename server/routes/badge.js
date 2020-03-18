const express = require('express')

const bcrypt = require('bcrypt')
const _ = require('underscore')

const Badge = require('../models/badge')
const { verifyToken, verifyAdmin_Role } = require('../middlewares/googleAuth')

const app = express()

app.get(
    '/badge',
    /* verifyToken, */ (req, res) => {
        let from = req.query.from || 0
        from = Number(from)

        let limit = req.query.limit || 5
        limit = Number(limit)

        Badge.find(
            { state: true },
            'name username city country email role state google github facebook img'
        )
            .skip(from)
            .limit(limit)
            .exec((err, badges) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                Badge.countDocuments({ state: true }, (err, count) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        })
                    }

                    res.json({
                        ok: true,
                        badges,
                        quantity: count
                    })
                })
            })
    }
)

app.post(
    '/badge',
    /* [verifyToken, verifyAdmin_Role], */ function(req, res) {
        let body = req.body

        let badge = new Badge({
            name: body.name,
            username: body.username,
            city: body.city,
            country: body.country,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        })

        badge.save((err, badgeDB) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                badge: badgeDB
            })
        })
    }
)

app.put(
    '/badge/:id',
    /* [verifyToken, verifyAdmin_Role], */ function(req, res) {
        let id = req.params.id
        let body = _.pick(req.body, [
            'name',
            'username',
            'city',
            'country',
            'email',
            'img',
            'state'
        ])

        Badge.findByIdAndUpdate(
            id,
            body,
            { new: true, runValidators: true },
            (err, badgeDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                res.json({
                    ok: true,
                    badge: badgeDB
                })
            }
        )
    }
)

app.delete(
    '/badge/:id',
    /* [verifyToken, verifyAdmin_Role], */ function(req, res) {
        let id = req.params.id

        // Badge.findByIdAndRemove(id, (err, deletedBadge) => {

        let changeState = {
            state: false
        }

        Badge.findByIdAndUpdate(
            id,
            changeState,
            { new: true },
            (err, deletedBadge) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    })
                }

                if (!deletedBadge) {
                    return res.status(400).json({
                        ok: false,
                        err: {
                            message: 'Badge not found'
                        }
                    })
                }

                res.json({
                    ok: true,
                    badge: deletedBadge
                })
            }
        )
    }
)

module.exports = app
