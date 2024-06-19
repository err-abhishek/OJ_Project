const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const schema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    dob: {
        type: Date,
        required: true
    },
    gender: {
        type: String,
        enum: ['Male', 'Female'],
        required: true
    },
    email: {
        type: String,
        unique: true,
        required: true
    },
    username: {
        type: String,
        unique: true,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});

schema.pre('save', async function (next) {
    const student = this;
    if (!student.isModified('password'))
        return next();
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(student.password, salt);
        student.password = hashedPassword;
        next();
    } catch (error) {
        return next(err);
    }
});

schema.methods.comparePassword = async function (candidatePassword) {
    try {
        const isMatch = await bcrypt.compare(candidatePassword, this.password);
        return isMatch;
    } catch (error) {
        throw (err);
    }
}

const student = mongoose.model('student',schema);
module.exports = student;
