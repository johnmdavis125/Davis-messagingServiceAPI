const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 
const { createToken, decodeToken } = require('../Utils/jwt_helpers'); 
const validatePostToMessageRoute = require('../Utils/validation_helpers'); 
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
            if (!foundMessage[0]) {
                shapedOutput = {
                    success: false,
                    errorMessage: 'invalid token, request denied',
                    name: 'access denied',
                    email: 'access denied',
                    message: 'access denied'
                }
            } else {
                const { success, token } = foundMessage[0]; 
                const { decodedToken, errMsg } = decodeToken(token);
        
                if (success) {
                // token has not been used
                            console.log('success!:', success)
                            Message.findOneAndUpdate({token: token}, {success: false}, (error, foundMessage) => {
                                error ? console.warn(error) : console.log(foundMessage); 
                            }); 
                            
                            shapedOutput = {
                                errorMessage: errMsg
                            }
                            
                            if (decodedToken){
                                // token is not expired
                                const { name, email, message } = decodedToken.data;  
                                Object.assign(shapedOutput, { 
                                        success: true,
                                        name: name,
                                        email: email,
                                        message: message
                                    }); 
                            } else {            
                                // token is expired
                                Object.assign(shapedOutput, {
                                        success: false,
                                        name: 'access denied',
                                        email: 'access denied',
                                        message: 'access denied'
                                    })
                            }
                } else {
                // token has been used
                        console.log('success:', success, 'token already used'); 
                        shapedOutput = {
                                success: false,
                                errorMessage: 'Sorry, this message is one-time access only.',
                                name: 'access denied',
                                email: 'access denied',
                                message: 'access denied'
                            }
                }
            }
            res.status(200).json(shapedOutput);     
        }
    })
})
                
                            
module.exports = router; 