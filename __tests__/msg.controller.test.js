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

let retrievedDocumentFromFirstEndpoint; 
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
        Message.find({})
        .then((documents) => {
            expect(documents.length).toEqual(1); 
            expect(documents[0].token).toBeTruthy(); 

            retrievedDocumentFromFirstEndpoint = documents[0]; 
            done(); 
        })
    })
})

describe('message controller: endpoint #2', () => {
    it('accepts GET to /api/message/:token in order to retrieve associated message from database', (done) => {
        
        request(app)
        .get(`/api/message/${retrievedDocumentFromFirstEndpoint.token}`)
        .then((response) => {
            console.log(response.text); 
            expect(response.statusCode).toEqual(200); 
            expect(JSON.parse(response.text).success).toEqual(true); 
            done(); 
        })
    })
    
    it('will return an error if the same token is requested more than once', (done) => {
        request(app)
        .get(`/api/message/${retrievedDocumentFromFirstEndpoint.token}`)
        .then((response) => {
            expect(response.statusCode).toEqual(200); 
            expect(JSON.parse(response.text).success).toEqual(false); 
            done(); 
        })
    })
})