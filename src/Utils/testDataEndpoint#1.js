const passingTestInput = {
    name: 'john doe', 
    email: 'john@gmail.com',
    message: 'test message'
}; 
const emptyNameTestInput = {
    name: '', 
    email: 'john@gmail.com',
    message: 'test message'
}; 
const invalidNameTypeTestInput = {
    name: 123, 
    email: 'john@gmail.com',
    message: 'test message'
}; 
const emptyEmailTestInput = {
    name: 'john doe', 
    email: '',
    message: 'test message'
}; 
const emptyEmailDomainTestInput = {
    name: 'john doe', 
    email: 'fakeEmail.com',
    message: 'test message'
}; 
const invalidEmailDomainTestInput = {
    name: 'john doe', 
    email: 'john@io',
    message: 'test message'
}; 
const emptyMessageTestInput = {
    name: 'john doe', 
    email: 'john@gmail.com',
    message: ''
}; 
const moreThan250Chars = {
    name: 'john doe', 
    email: 'john@gmail.com',
    message: 'Without spaces, this text has more than 250 characters. sit amet sit amet porttitor eget dolor morbi non arcu risus quis varius quam quisque id diam vel quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum posuere lorem ipsum dolor sit amet consectetur adipiscing elit duis tristique sollicitudin nibh sit amet commodo nulla facilisi nullam vehicula ipsum a arcu cursus'
}; 

module.exports = {
    passingTestInput,
    emptyNameTestInput,
    invalidNameTypeTestInput,
    emptyEmailTestInput,
    emptyEmailDomainTestInput,
    invalidEmailDomainTestInput,
    emptyMessageTestInput,
    moreThan250Chars
}