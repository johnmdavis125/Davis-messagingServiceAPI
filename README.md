## Messaging Service API 
#### _Code Challenge Submission - Davis_
## Table of Contents 
- [Project Overview](#project-overview)
- [Running the Code Locally](#running-the-code-locally)
- [Testing with Postman](#testing-with-postman)
- [Postman Test Examples](#postman-test-examples)
- [General Project Notes/Discussion](#general-notes)
- [Notable Dependencies](#notable-dependencies)
- [Thank You](#thank-you)

### Project Overview
- Description  
    As described in provided project details, this service API supports a theoretical one-time messaging feature. This is accomplished by exposing two API endpoints for consumption by the to-be client. Given a valid input message, a POST call to endpoint #1 (/api/message) will generate a Json Web Token (JWT) with a set expiration time of 24 hours. Given this JWT, the client can GET from endpoint #2 (/api/message/:token) to retrieve said message, provided it's still within the 24 expiration timeline. The message can only be retrieved once. 

- Development Approach
    - Requirements Management: JIRA - Kanban board w/integrated commit tracking
        - [JIRA Kanban Board](https://johnmdavis125.atlassian.net/jira/software/projects/DTI/boards/2)
    - Test Driven Development (TDD) using Jest & Supertest
    - Two distinct mongoDB instances for test & dev environments
        - 'Davis-test' -> used exclusively for testing
        - 'Davis-ServiceAPI' -> acts as the main 'production' db
    - Git workflow: feature branches, merged into master via pull requests

### Running the Code Locally
- Clone the repo
    ```
    git clone https://github.com/johnmdavis125/Davis-messagingServiceAPI.git
- Install Dependencies
    - After navigating into the project directory, install all dependencies with:
    ```
    npm install

- Environment Variables
    - Create a '.env' file (to store environment variables) in the top level of your project directory. 
    - For the purposes of this exercise, I will share my environment variables here. These would never be published in this fashion in production. A secrets management solution such as hashicorp vault or the built-in env variable storage that comes with your deployment platform of choice could be used instead.
    - Copy and paste the following lines into the .env file: 
        ```
        MONGODB_TEST_URI = "mongodb://localhost:27017/Davis-test"

        MONGODB_URI = "mongodb://localhost:27017/Davis-ServiceAPI"

        PRIVATE_KEY = "T3ST-K3Y-123"
    - Note: if running mongoDB on a port other than default (27017) as listed above, modify as desired
    - Note: if you want the node/express dev server to run on a port other default (3001), add a 'PORT' variable in your .env file as well: 
        ```
        PORT = <yourportnumber>
- Start scripts 
    - The dev server and test suite are configured to support being run individually or simultaneously as desired. After completing the configuration steps above...
    - Start the development server:
        ```
        npm run dev
    - In a separate terminal window, start the test runner:
        ```
        npm run test
    - Note: There should be 4 test suites / 20 tests running. If only some of the tests run, you may need to hit 'a' to run all tests. 

        ![testWatchOptions](/public/images/testWatchOptions.png) 

[Back to Top](#table-of-contents)

### Testing with Postman
- Endpoint #1 - Creating the token
    - Path: 
        ```
        http://localhost:3001/api/message
    - Method: POST
    - Input: JSON
        ```json
        {
            "name": "string",
            "email": "string",
            "message": "string"
        }
        ```
        - Input will be validated against the following rules or will return an error. 
            - Name:
                - type: 'string'
                - length: minimum 1 char required
            - Email:
                - type: 'string'
                - format: 'email'
                    - alphanumeric text + @ + 2 domain segments
            - Message: 
                - type: 'string'
                - length: limited to 250 characters  
    - Output: JSON
        ```
        {
            "success": boolean,
            "errorMessage": null || "string",
            "token": "string",
        }
    - Note: the errorMessage field should be null unless an error has occurred

- Endpoint #2 - Retrieving the message
    - Path:
        ```
        http://localhost:3001/api/message/:token
    - Method: GET
        - Note: the ':token' parameter should be copied & pasted from the 'token' field in the result of a previous postman test to endpoint #1. Again, this can only be done once before returning an error, and must be completed prior to token expiration.
    - Output: JSON
        ```
        {
            "success": boolean,
            "errorMessage": null || "string",
            "name": "string",
            "email": "string",
            "message": "string"
        }
        ```
        - Note: the errorMessage field should be null unless an error has occurred
        - Note: the name, email, and message fields should match the values provided in endpoint #1

[Back to Top](#table-of-contents)

### Postman Test Examples
- GIVEN VALID INPUT:  

    Endpoint #1  
    - Valid Input -> POST to Endpoint #1
        ![validInputEndpoint1](/public/images/validInputEndpoint1.png)
    - Valid Input -> See resulting document in mongoDB
        ![validInputEndpoint1db.png](/public/images/validInputEndpoint1db.png)  
    
    Endpoint #2  
    - Valid Input -> GET to Endpoint #2
        ![validGetEndpoint2.png](/public/images/validGetEndpoint2.png)
    - Valid Input -> After successful GET, 'success' changed to 'false'
        ![validGetEndpoint2db.png](/public/images/validGetEndpoint2db.png)
    - Valid Input -> GET to Endpoint #2 attempted a second time, denied
        ![validInputOneTimeUse.png](/public/images/validInputOneTimeUse.png)
     
- GIVEN INVALID INPUT:  
Endpoint #1
    - Invalid Input for 'name' -> POST to Endpoint #1 (returns error)
        ![invalidName.png](/public/images/invalidName.png) 
    - Invalid Input for 'email' -> POST to Endpoint #1 (returns error)
        ![invalidEmail.png](/public/images/invalidEmail.png) 
    - Invalid Input for 'message' -> POST to Endpoint #1 (returns error)
        ![invalidMessage.png](/public/images/invalidMessage.png) 

- TOKEN EXPIRED:  
    - Valid Input -> POST to Endpoint #1
        ![expirationPt2.png](/public/images/expirationPt1.png)  
    - Attempted GET after expiration -> GET to Endpoint #2, denied
        ![expirationPt2.png](/public/images/expirationPt2.png)  

    - **_Note on token expiration timeframe:_** 
        - As specified in the requirements, the default JWT expiration timeframe is set to 24 hrs (see line 25 in 'messages_controller.js'). This can easily be manipulated for ease of testing. 

[Back to Top](#table-of-contents)

### General Notes
- Requirements Management
    - JIRA - Kanban board w/integrated commit tracking
        - [JIRA Kanban Board](https://johnmdavis125.atlassian.net/jira/software/projects/DTI/boards/2)
- Interpreting the requirements: 
    - Changed first 'message' key of JSON objects to 'errorMessage'
        - To avoid key naming conflicts on the JSON output of endpoint #2 (project specification includes two instances of the 'message' key)
        - This is an example of something I would communicate with team & clarify with requirements author(s)/stakeholder(s) prior to implementing. 
    - My approach to implementing single-use JWT auth
        - After considerable research on auth using JWTs, the inability to manually 'revoke' a JWT on demand (outside its built-in expiration) appears to be an inherent limitation of the JWT-based auth model, and to the best of my knowledge is reflected by industry consensus. 
        - For this reason, instead of trying to manually revoke the JWT, I decided to utilize the 'success' key of each document stored in the db as a 'state' variable indicating whether or not the token had been used yet. Each request to endpoint #2 must check this 'state' and proceed by either allowing message retrieval (and altering the document state to 'used') or by denying access and returning an error if state had already been set by a previous request. Notably, it does not have to be the success key that's used for this purpose. Alternatively, an additional boolean such as 'tokenUsed' could be added and used for the same purpose...dealer's choice. 
        - One potential drawback of this solution is that, in a sense, you are re-introducing state to what was a stateless server (undermining one of the main benefits of using the JWT-auth model). However, because the inherent purpose of this feature limits requests to only ~1 per message anyway, the additional computational 'cost' should be reasonably limited.
        - This is an example of something I would communicate with the team & clarify with requirements author(s)/stakeholder(s) prior to implementing. 

[Back to Top](#table-of-contents)
    
### Notable Dependencies
- jsonwebtoken: JWT generation & verification
    - [npm docs](https://www.npmjs.com/package/jsonwebtoken)
    - [github](https://github.com/auth0/node-jsonwebtoken#readme)
- joi: security/validation
    - [npm docs](https://www.npmjs.com/package/joi)
    - [github](https://github.com/hapijs/joi)
- jest/supertest: testing
    - [jest npm](https://www.npmjs.com/package/jest)
    - [jest home](https://jestjs.io/)
    - [jest github](https://github.com/facebook/jest)
    - [supertest npm](https://www.npmjs.com/package/supertest)
    - [supertest home](https://openbase.com/js/supertest/documentation)
    - [supertest github](https://github.com/visionmedia/supertest)
- (DOMpurify): security/validation
    - [dompurify npm](https://www.npmjs.com/package/dompurify)
    - Considered but did not implement (would likely be implemented client-side)

[Back to Top](#table-of-contents)

### Thank You
- I really enjoyed working on this project and feel like I learned quite a bit diving into auth & TDD, so thank you for the opportunity and for your consideration!

[Back to Top](#table-of-contents)