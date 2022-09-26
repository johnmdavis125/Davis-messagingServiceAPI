const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 
const createToken = require('../Utils/jwt_helpers'); 
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
        if (success && !errorMessage){
            token = createToken(validatedUserInput, 5); 
        }

    // output shape
        let shapedData = {
            success: success,
            message: errorMessage,
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
        // console.log('foundMessage[0]', foundMessage); 

        // default/hardcoded for now -> need to decode token -> build utility function
        let errorMessage = null;
        let name = 'test name';
        let email = 'john@gmail.com';
        let message = 'test message'; 


        let shapedOutput = { 
            success: success,
            message: errorMessage,
            name: name,
            email: email,
            message: message
        }
        
        if (success) {
            error ? res.status(404).json(error) : res.status(200).json(shapedOutput);     
        }
    })
})


module.exports = router; 