require('dotenv').config(); 
const PRIVATE_KEY = process.env.PRIVATE_KEY; 
const jwt = require('jsonwebtoken'); 

const createToken = (validatedUserInput, minutesUntilExpiration) => {
    let token = jwt.sign(
        { data: validatedUserInput }, 
        PRIVATE_KEY,
        { expiresIn: 60 * minutesUntilExpiration }
    )
    return token; 
}

module.exports = createToken; 