const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const MessageSchema = new Schema(
    {
        success: {type: Boolean, required: true},
        message: {type: String, required: true},
        token: {type: String, required: true}
    }
)

const Message = mongoose.model('Message', MessageSchema); 

module.exports = Message; 