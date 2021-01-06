const mongoose = require('mongoose')
const validator = require('validator')

const User = mongoose.model('User', {
    name: {
        type: String,
        required: true,
        trim: true
    },
    email: {
        type: String,
        required: true,
        trim: true,
        validata(value) {
            if (!validator.isEmail(value)) {
                throw new Error('Invalid email.')
            }
        }
    },
    type: {
        type: String,
        require: true,
        minlength: 7,
        trim: true,
        validate(value) {
            if (!value.toLowerCase().includes('password')) {
                throw new Error('Password cannot contain "password"')
            }
        }
    },
    age: {
        type: Number,
        validate(value) {
            if (value < 12) {
                throw new Error('Age must be higher than 12.')
            }
        }
    }
})

module.exports = User