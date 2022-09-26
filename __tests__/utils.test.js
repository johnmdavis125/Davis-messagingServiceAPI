
describe('jwt.helpers.test.js: createToken utility function', () => {
    describe('accepts validated user input in order to generate, sign, and return json web token', () => {
        
        const createToken = require('../src/Utils/jwt_helpers'); 

        let testInput = {
            name: 'john doe', 
            email: 'john@mail.com',
            message: 'test message'
        }; 
       
        let minutesUntilExpiration = 3; 
        
        let result = createToken(testInput, minutesUntilExpiration); 
       
        let decodedResult = JSON.parse((atob(result.split('.')[1]))).data.message; 

        it('imports createToken func from utils directory', () => {
            console.log('imported createToken func', !!createToken); 
            
            expect(result).toBeTruthy();
        })

        it('returns a string with a header, msg, and signature separated by .', () => {
            expect(result.split('.').length).toEqual(3); 
        })

        it('encodes the input given to the function', () => {
            expect(decodedResult).toEqual('test message'); 
        })
    })
})