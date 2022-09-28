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
        let minutesUntilExpiration = 3;     
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
        error ? res.status(404).send(error) :
        res.status(200).send(createdMessage)
    });
});

// Endpoint #2: Retrieving the message 
router.get('/message/:token', (req, res) => {
    Message.find({ token: req.params.token }, (error, foundMessage) => {
        const { success, token } = foundMessage[0]; 
        const { decodedToken, errMsg } = decodeToken(token);
        let shapedOutput; 
        
        // Token has not been used
        if (success) {
            console.log('success!:', success)
            Message.findOneAndUpdate({token: token}, {
                success: false
            }, (error, foundMessage) => {
                error ? console.warn(error) : console.log(foundMessage); 
            })
            
            shapedOutput = {
                errorMessage: errMsg
            }
            if (decodedToken){
                const { name, email, message } = decodedToken.data;  
                Object.assign(shapedOutput, { 
                    success: true,
                    name: name,
                    email: email,
                    message: message
                }); 
            } else {            
                Object.assign(shapedOutput, {
                    success: false,
                    name: 'access denied',
                    email: 'access denied',
                    message: 'access denied'
                })
            }
        } else {
        // Token has been used
            console.log('success:', success, 'token already used'); 
            shapedOutput = {
                success: false,
                errorMessage: 'Sorry, this message is one-time access only.',
                name: 'access denied',
                email: 'access denied',
                message: 'access denied'
            }
        }
        error ? res.status(404).json(error) : res.status(200).json(shapedOutput);    
    })
})


module.exports = router; 