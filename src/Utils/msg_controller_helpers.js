const Message = require('../Models/Message'); 
const { decodeToken } = require('./jwt_helpers'); 

const changeTokenStateToUsed = (foundMessage) => {
    const { success, token } = foundMessage[0]; 

    console.log('success!:', success)
    Message.findOneAndUpdate({token: token}, {success: false}, (error, updatedDocument) => {
        error ? console.warn(error) : console.log(updatedDocument); 
    }); 
}

const shapeSecondUseAccessDeniedOutput = () => {
    
    let shapedOutput = {
        success: false,
        errorMessage: 'I\'m sorry, this token has already been used. Your request cannot be processed.',
        name: 'access denied',
        email: 'access denied',
        message: 'access denied'
    } 
    return shapedOutput; 
}

const shapeInvalidTokenAccessDeniedOutput = () => {
    
    let shapedOutput = {
        success: false,
        errorMessage: 'I\'m sorry, the submitted token is not valid, cannot process request',
        name: 'access denied',
        email: 'access denied',
        message: 'access denied'
    } 
    return shapedOutput; 
}

const shapeExpiredTokenAccessDeniedOutput = (foundMessage) => {
    const { token } = foundMessage[0]; 
    const { errMsg } = decodeToken(token);
    
    let shapedOutput = {
        success: false,
        errorMessage: errMsg,
        name: 'access denied',
        email: 'access denied',
        message: 'access denied'
    } 
    return shapedOutput; 
}

const shapeAuthorizedOutputAndSetTokenToUsed = (foundMessage) => {
    const { token } = foundMessage[0]; 
    const { decodedToken, errMsg } = decodeToken(token);
    const { name, email, message } = decodedToken.data;
    
    changeTokenStateToUsed(foundMessage); 

    let shapedOutput = {
        success: true,
        errorMessage: errMsg,
        name: name,
        email: email,
        message: message
    }
    return shapedOutput; 
}



module.exports = {
    shapeSecondUseAccessDeniedOutput,
    shapeExpiredTokenAccessDeniedOutput,
    shapeInvalidTokenAccessDeniedOutput,
    changeTokenStateToUsed,
    shapeAuthorizedOutputAndSetTokenToUsed
}; 