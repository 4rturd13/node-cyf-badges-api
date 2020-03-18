const express = require('express')
const fileUpload = require('express-fileupload')
const app = express()

const Badge = require('../models/badge')

const fs = require('fs')
const path = require('path')

// Default options
app.use(fileUpload())

app.put('/upload/:type/:id', function(req, res) {
    let type = req.params.type
    let id = req.params.id

    if (!req.files) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'No file selected'
            }
        })
    }

    // Type validate
    let validTypes = ['badge']
    if (validTypes.indexOf(type) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed types are ' + validTypes.join(', ')
            }
        })
    }

    let file = req.files.file
    let shortName = file.name.split('.')
    let extensions = shortName[shortName.length - 1]

    // Allowed extensions
    let validextensions = ['png', 'jpg', 'gif', 'jpeg']

    if (validextensions.indexOf(extensions) < 0) {
        return res.status(400).json({
            ok: false,
            err: {
                message: 'Allowed extensions are ' + validextensions.join(', '),
                ext: extensions
            }
        })
    }

    // Change file name
    let fileName = `${id}-${new Date().getMilliseconds()}.${extensions}`

    file.mv(`uploads/${type}/${fileName}`, err => {
        if (err)
            return res.status(500).json({
                ok: false,
                err
            })

        // Here, loaded image
        if (type === 'badge') {
            badgeImage(id, res, fileName)
        } else {
            return res.status(500).json({
                ok: false,
                err
            })
            // otherImage(id, res, fileName) /* prepare for other route to img */
        }
    })
})

function badgeImage(id, res, fileName) {
    Badge.findById(id, (err, badgeDB) => {
        if (err) {
            deleteFile(fileName, 'badge')

            return res.status(500).json({
                ok: false,
                err
            })
        }

        if (!badgeDB) {
            deleteFile(fileName, 'badge')

            return res.status(400).json({
                ok: false,
                err: {
                    message: 'Badge does not exist'
                }
            })
        }

        deleteFile(badgeDB.img, 'badge')

        badgeDB.img = fileName

        badgeDB.save((err, savedBadge) => {
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                })
            }

            res.json({
                ok: true,
                badge: savedBadge,
                img: fileName
            })
        })
    })
}

// function productImage(id, res, fileName) {
//     Product.findById(id, (err, productDB) => {
//         if (err) {
//             deleteFile(fileName, 'products')

//             return res.status(500).json({
//                 ok: false,
//                 err
//             })
//         }

//         if (!productDB) {
//             deleteFile(fileName, 'products')

//             return res.status(400).json({
//                 ok: false,
//                 err: {
//                     message: 'Badge does not exist'
//                 }
//             })
//         }

//         deleteFile(productDB.img, 'products')

//         productDB.img = fileName

//         productDB.save((err, savedProduct) => {
//             res.json({
//                 ok: true,
//                 product: savedProduct,
//                 img: fileName
//             })
//         })
//     })
// } TODO: delete if upload img work

function deleteFile(imageName, type) {
    const pathImage = path.resolve(
        __dirname,
        `../../uploads/${type}/${imageName}`
    )
    if (fs.existsSync(pathImage)) {
        fs.unlinkSync(pathImage)
    }
}

module.exports = app
