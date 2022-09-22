const mongoose = require('mongoose');
const Schema = mongoose.Schema; 

const MessageSchema = new Schema(
    {
        success: {type: Boolean},
        message: {type: String},
        token: {type: String}
    }
)

const Message = mongoose.model('Message', MessageSchema); 

module.exports = Message; 