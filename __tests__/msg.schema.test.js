const Message = require('../src/Models/Message'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); 
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI; 

beforeAll(() => {
    mongoose.connect(MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); 

    mongoose.connection
        .once('open', () => console.log('msg.schema.test connected to test db'))
        .on('error', ()=>{
            console.warn('mongo test cxn warning', error)
    });

    // mongoose.connection.collections.messages.drop(); 
})

describe('message model/schema', () => {
    it('allows new messages to be saved in db', (done) => {
        const testMessage = {
            success: true,
            message: 'error message is different',
            token: 'test token string - schema test'
        }; 
        Message.create(testMessage)
        .then(() => {
            expect(!testMessage.isNew); 
            done(); 
        })
    })
})