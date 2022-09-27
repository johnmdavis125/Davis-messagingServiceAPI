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

const decodeToken = (token) => {
    let decodedToken;
    let errMsg = null;

    try {
        decodedToken = jwt.verify(token, process.env.PRIVATE_KEY);
    } catch(error) {
        errMsg = error; 
    } finally {
        const decodeTokenResult = {
            decodedToken: decodedToken,
            errMsg: errMsg
        }
        return decodeTokenResult;
    }
   
}

module.exports = {
    createToken,
    decodeToken
}; 