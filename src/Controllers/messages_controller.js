const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 
const createToken = require('../Utils/jwt_helpers'); 
const validatePostToMessageRoute = require('../Utils/validation_helpers'); 
// Endpoint #1: Creating the Token 
router.post('/message', (req, res) => {
    console.log('req.body', req.body);
    
    let success = false;  
    let errorMessage = 'default'; 
    let token = 'default'; 
    let validatedUserInput; 
    
    // validation logic (placeholder)
        const { error, value } = validatePostToMessageRoute(req.body);
        console.log(error, value); 

        if (error) {
            errorMessage = error.details;
        } else {
            success = true; 
            errorMessage = null; 
            validatedUserInput = value; 
        }

    // JWT generated
        if (success && !errorMessage){
            token = createToken(validatedUserInput, 5); 
        }

    // output shape
        let shapedData = {
            success: success,
            message: errorMessage,
            token: token
        }
        console.log('shapedData', shapedData); 
   
    Message.create(shapedData, (error, createdMessage) => {    
        error ? res.status(404).send(error) :
        res.status(200).send(createdMessage)
    });
});

module.exports = router; 