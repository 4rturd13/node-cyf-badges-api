const mongoose = require('mongoose')
const uniqueValidator = require('mongoose-unique-validator')

let validRoles = {
    values: ['ADMIN_ROLE', 'USER_ROLE'],
    message: '{VALUE} is not a valid roles'
}

let Schema = mongoose.Schema

let badgeSchema = new Schema({
    name: {
        type: String,
        required: [true, 'Name is required']
    },
    username: {
        type: String,
        unique: true,
        required: false
    },
    city: {
        type: String,
        required: false
    },
    country: {
        type: String,
        required: false
    },
    email: {
        type: String,
        unique: true,
        required: [true, 'Email is required']
    },
    password: {
        type: String,
        required: [true, 'Password is required']
    },
    img: {
        type: String,
        required: false
    },
    role: {
        type: String,
        default: 'USER_ROLE',
        enum: validRoles
    },
    state: {
        type: Boolean,
        default: true
    },
    google: {
        type: Boolean,
        default: false
    },
    github: {
        type: Boolean,
        default: false
    },
    facebook: {
        type: Boolean,
        default: false
    }
})

badgeSchema.methods.toJSON = function() {
    let badge = this
    let badgeObject = badge.toObject()
    delete badgeObject.password

    return badgeObject
}

badgeSchema.plugin(uniqueValidator, { message: '{PATH} must be unique' })

module.exports = mongoose.model('Badge', badgeSchema)
