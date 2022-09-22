const request = require('supertest'); 
const app = require('../src/app'); 

describe('express web server', () => {
    it('accepts GET request to PORT 3001 and responds with OK status 200', async () => {
        const response = await request(app).get('/'); 
        expect(response.statusCode).toBe(200); 
    })
})