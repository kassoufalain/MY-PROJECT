const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { isEmail } = require('validator');

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: [true, 'Please enter an email'],
        unique: true,
        lowercase: true,
        validate: [isEmail, 'Please enter a valid email']
    },
    password: {
        type: String,
        required: [true, 'Please enter a password'],
        minlength: [6, 'Minimum password length is 6 characters']
    }
});

// Method to generate JWT token
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
        expiresIn: '1h',
    });
    return token;
};

// Static method to login user
userSchema.statics.login = async function (email, password) {
    const user = await this.findOne({ email });
    if (user) {
        const auth = await bcrypt.compare(password, user.password);
        if (auth) {
            const token = user.generateAuthToken();
            return { user, token };
        }
        throw new Error('Incorrect password');
    }
    throw new Error('Incorrect email');
};

// Static method to signup user
userSchema.statics.signup = async function (email, password) {
    // Check if email already exists
    const existingUser = await this.findOne({ email });
    if (existingUser) {
        throw new Error('Email already exists');
    }

    // Hash the password
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create a new user
    const user = await this.create({ email, password: hashedPassword });
    const token = user.generateAuthToken();
    return { user, token };
};

const User = mongoose.model('User', userSchema);

module.exports = User;
