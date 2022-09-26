
describe('ENDPOINT #1 /api/message - accepts validated user input in order to generate, sign, and return json web token and/or associated errors', () => {

    const { 
        passingTestInput,
        emptyNameTestInput,
        invalidNameTypeTestInput,
        emptyEmailTestInput,
        emptyEmailDomainTestInput,
        invalidEmailDomainTestInput,
        emptyMessageTestInput,
        moreThan250Chars
    } = require('../src/Utils/testDataEndpoint#1'); 


    describe('validation_helpers.js: validate user input to endpoint #1...if error, return message', () => {
        
        const validatePostToMessageRoute = require('../src/Utils/validation_helpers'); 
        
        it('imports validatePostToMessageRoute func from utils directory', () => {
            console.log('imported validatePostToMessageRoute', !!validatePostToMessageRoute); 
            
            expect(validatePostToMessageRoute).toBeTruthy(); 
        })

        describe('accepts user input, enforces detailed payload validation w/JOI, returns any error messages', () => {
            it('returns - error: undefined when input legitimate', () => {
                let validatedPostPayload = validatePostToMessageRoute(passingTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(passingTestInput); 
                expect(error).toEqual(undefined); 
            })
            it('returns error when name field empty', () => {
                let validatedPostPayload = validatePostToMessageRoute(emptyNameTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(emptyNameTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when name field invalid type', () => {
                let validatedPostPayload = validatePostToMessageRoute(invalidNameTypeTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(invalidNameTypeTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when email field empty', () => {
                let validatedPostPayload = validatePostToMessageRoute(emptyEmailTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(emptyEmailTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when email domain empty', () => {
                let validatedPostPayload = validatePostToMessageRoute(emptyEmailDomainTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(emptyEmailDomainTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when email domain invalid - less than 2 segments', () => {
                let validatedPostPayload = validatePostToMessageRoute(invalidEmailDomainTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(invalidEmailDomainTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when message field empty', () => {
                let validatedPostPayload = validatePostToMessageRoute(emptyMessageTestInput); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(emptyMessageTestInput); 
                expect(error).toBeTruthy();  
            })
            it('returns error when message more than 250 characters', () => {
                let validatedPostPayload = validatePostToMessageRoute(moreThan250Chars); 
                const { error, value } = validatedPostPayload; 
                expect(value).toEqual(moreThan250Chars); 
                expect(error).toBeTruthy();  
            })
        })
    })
   
    describe('jwt.helpers.js: createToken utility function', () => {
        
        const createToken = require('../src/Utils/jwt_helpers'); 
       
        let minutesUntilExpiration = 3; 
        
        let result = createToken(passingTestInput, minutesUntilExpiration); 
       
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