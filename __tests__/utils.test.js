
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
   
    describe('jwt.helpers.js', () => {

        let testToken; 

        const { createToken, decodeToken } = require('../src/Utils/jwt_helpers');  

        describe('createToken utility function', () => {
            
            
            let minutesUntilExpiration = 3; 
            
            testToken = createToken(passingTestInput, minutesUntilExpiration); 
            
            let manuallyDecodedBase64Message = JSON.parse((atob(testToken.split('.')[1]))).data.message; 
            
            it('imports createToken func from utils directory', () => {
                console.log('imported createToken func', !!createToken); 
                
                expect(testToken).toBeTruthy();
            })
            
            it('returns a string with a header, msg, and signature separated by .', () => {
                expect(testToken.split('.').length).toEqual(3); 
            })
            
            it('encodes the input given to the function', () => {
                expect(manuallyDecodedBase64Message).toEqual('test message'); 
            })
        })
        
        describe('decodeToken utility function', () => {
                        
            let { decodedToken, errMsg } = decodeToken(testToken); 
            
            it('decodes the JWT (within time of expiration)', () => {
                expect(decodedToken.data).toBeTruthy(); 
                expect(errMsg).toBeFalsy(); 
            })
            
            it('cannot decode the JWT beyond time of expiration', () => {
                let minutesUntilExpiration = 2; 
                let testTokenA = createToken(passingTestInput, minutesUntilExpiration); 
                let testTokenB = createToken(passingTestInput, minutesUntilExpiration); 

                // decode testTokenA within expiration time
                let decodeTokenAResult = decodeToken(testTokenA); 
                expect(decodeTokenAResult.decodedToken.data).toBeTruthy();
                expect(decodeTokenAResult.errMsg).toBeFalsy() 

                // attempt to decode testTokenB beyond expiration (should fail)
                jest.useFakeTimers()
                let time1 = (Date.now() / 1000); 

                jest.advanceTimersByTime(1000 * 60 * 3); // 3 min           
                let time2 = (Date.now() / 1000); 
                
                let timePassed = time2 - time1; 
                if (timePassed >= (minutesUntilExpiration * 60)){
                    console.log('testTokenB expired')
                } else {
                    console.log('testTokenB valid'); 
                }

                let decodeTokenBResult = decodeToken(testTokenB); 
                expect(decodeTokenBResult.decodedToken).toBeFalsy();
                expect(decodeTokenBResult.errMsg).toBeTruthy(); 

            })
                
        })
    })
})