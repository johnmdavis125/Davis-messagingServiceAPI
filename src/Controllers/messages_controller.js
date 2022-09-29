const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 
const { createToken, decodeToken } = require('../Utils/jwt_helpers'); 
const validatePostToMessageRoute = require('../Utils/validation_helpers'); 
const { 
    shapeSecondUseAccessDeniedOutput, 
    shapeExpiredTokenAccessDeniedOutput, 
    shapeInvalidTokenAccessDeniedOutput,
    shapeAuthorizedOutputAndSetTokenToUsed
} = require('../Utils/msg_controller_helpers'); 

// Endpoint #1: Creating the Token 
router.post('/message', (req, res) => {
    let success = false;  
    let errorMessage = 'default'; 
    let token = 'default'; 
    let validatedUserInput; 
    
    // validation
        const { error, value } = validatePostToMessageRoute(req.body);

        if (error) {
            errorMessage = error.details;
        } else {
            success = true; 
            errorMessage = null; 
            validatedUserInput = value; 
        }

    // generate JWT
        let minutesUntilExpiration = 1;     
        if (success && !errorMessage){
            token = createToken(validatedUserInput, minutesUntilExpiration); 
        }

    // output shape
        let shapedData = {
            success: success,
            errorMessage: errorMessage,
            token: token
        }

    Message.create(shapedData, (error, createdMessage) => {    
        error ? res.status(404).send(error) : res.status(200).send(createdMessage)
    });
});

// Endpoint #2: Retrieving the message 
router.get('/message/:token', (req, res) => {
    Message.find({ token: req.params.token }, (error, foundMessage) => { 
        let shapedOutput; 
        if (error) {
            res.status(404).json(error) 
        } else {            
            let tokenParameterIsValid = foundMessage[0] ? true : false; 
            let tokenHasBeenUsed; 
            let tokenHasExpired; 

            if (tokenParameterIsValid){
                    tokenHasBeenUsed = foundMessage[0].success ? false : true; 
                    tokenHasExpired = decodeToken(foundMessage[0].token).decodedToken ? false : true; 

                    shapedOutput = tokenHasBeenUsed ? shapeSecondUseAccessDeniedOutput()
                                : tokenHasExpired ? shapeExpiredTokenAccessDeniedOutput(foundMessage)
                                : shapeAuthorizedOutputAndSetTokenToUsed(foundMessage)
            } else {
                shapedOutput = shapeInvalidTokenAccessDeniedOutput();             
            }
            res.status(200).json(shapedOutput);     
        }
    })
})
                                            
module.exports = router; 