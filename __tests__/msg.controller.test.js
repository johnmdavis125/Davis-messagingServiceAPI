const app = require('../src/app'); 
const mongoose = require('mongoose'); 
require('dotenv').config(); 
const MONGODB_TEST_URI = process.env.MONGODB_TEST_URI; 
const request = require('supertest'); 
const Message = require('../src/Models/Message');

beforeAll(() => {
    mongoose.connect(MONGODB_TEST_URI, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    }); 

    mongoose.connection
        .once('open', () => console.log('msg.controller.test connected to test db'))
        .on('error', ()=>{
            console.warn('mongo test cxn warning', error)
    });

    mongoose.connection.collections.messages.drop(); 
})

describe('message controller: endpoint #1', () => {
    it('accepts POST to /api/message to create a new message', (done) => {

        request(app)
        .post('/api/message')
        .send({
            name: 'john',
            email: 'john@mail.com',
            message: 'hello!'
        })
        .then((response) => {
            expect(response.statusCode).toEqual(200)
        done(); 
        })
    })

    it('finds the newly created message in the database', (done) => {
        Message.find({ token: 'this will be a token' })
        .then((documents) => {
            expect(documents[0].token).toEqual('this will be a token'); 
        done(); 
        })
        
    })
})