/*
const express = require('express');
const { loginUser, signupUser } = require('../controllers/authController'); // Ensure these are correctly imported

const router = express.Router();

router.post('/login', loginUser); // Check if loginUser is defined
router.post('/signup', signupUser); // Check if signupUser is defined

module.exports = router;
 */

/*   */

// auth.js
/*   */
const express = require('express');
const { loginUser, signupUser } = require('../controllers/authController');

console.log('loginUser:', loginUser); // Should print the function definition
console.log('signupUser:', signupUser); // Should print the function definition

const router = express.Router();

router.post('/login', (req, res) => {
    console.log('/login route hit');
    loginUser(req, res);
});
router.post('/signup', (req, res) => {
    console.log('/signup route hit');
    signupUser(req, res);
});

module.exports = router;
