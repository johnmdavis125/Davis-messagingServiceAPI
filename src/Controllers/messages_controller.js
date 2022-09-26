const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 
const createToken = require('../Utils/jwt_helpers'); 

// Endpoint #1: Creating the Token 
router.post('/message', (req, res) => {
    console.log('req.body', req.body);
    
    let success = false;  
    let errorMessage = 'default'; 
    let token = 'default'; 
    let validatedUserInput; 
    
    // validation logic (placeholder)
        let validated = true;
        if (validated) {
            success = true; 
            errorMessage = null; 
            validatedUserInput = req.body; 
        }

    // JWT generated
        if (success && !errorMessage){
            token = createToken(validatedUserInput, 5); 
        }

    // output shape
        let shapedData = {
            success: success, // true
            message: errorMessage, // null 
            token: token // should be an actual token now
        }
        console.log('shapedData', shapedData); 
   
    Message.create(shapedData, (error, createdMessage) => {    
        error ? res.status(404).send(error) :
        res.status(200).send(createdMessage)
    });
});

module.exports = router; 