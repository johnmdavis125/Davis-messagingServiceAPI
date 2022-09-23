const express = require('express'); 
const app = express(); 


const cors = require('cors'); 
app.use(cors({
    origin: "http://localhost:3000",
}
));

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send('express get request to base URL @ http://localhost:3001. Server standing by to fulfill requests from authorized client(s)');
});

module.exports = app; 