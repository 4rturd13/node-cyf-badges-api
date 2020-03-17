const jwt = require('jsonwebtoken')

// Token validate ==>
let verifyToken = (req, res, next) => {
    let token = req.get('Authorization')

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }

        req.badge = decoded.badge
        next()
    })
}
// Token validate <==

//Admin role validate ==>
let verifyAdmin_Role = (req, res, next) => {
    let badge = req.badge

    if (badge.role === 'ADMIN_ROLE') {
        next()
    } else {
        return res.json({
            ok: false,
            err: {
                message: 'Badge is not admin'
            }
        })
    }
}
//Admin role validate <==

// Token validate to img ==>
let verifyTokenImg = (req, res, next) => {
    let token = req.query.token

    jwt.verify(token, process.env.SEED, (err, decoded) => {
        if (err) {
            return res.status(401).json({
                ok: false,
                err: {
                    message: 'Invalid token'
                }
            })
        }

        req.badge = decoded.badge
        next()
    })
}
// Token validate to img <==

module.exports = {
    verifyToken,
    verifyAdmin_Role,
    verifyTokenImg
}
