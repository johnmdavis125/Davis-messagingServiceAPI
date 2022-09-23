const express = require('express'); 
const router = express.Router(); 
const Message = require('../Models/Message'); 

// Endpoint #1: Creating the Token 
router.post('/message', (req, res) => {
    console.log('req.body', req.body);
    let { name, email, message } = req.body; 

    let success = false;  
    let errorMessage = 'no error'; 
    let token = ''; 

    // validation logic 
    let validated = true;
    if (validated) {
        success = true; 
    }

    // error messages
    if (errorMessage) {
        message = errorMessage; 
    }

    // JWT generated
    let newToken = 'token string'; 
    if (newToken) {
        token = 'this will be a token';
    }

    // output shape
    let shapedData = {
        success: success, // true
        message: message, // 'no error'
        token: token // 'this will be a token'
    }
    console.log(shapedData); 
    Message.create(shapedData, (error, createdMessage) => {    
        error ? res.status(404).send(error) :
        res.status(200).send(createdMessage)
    });
});

module.exports = router; 