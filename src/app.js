const express = require('express'); 
const PORT = process.env.PORT || 3001; 
const app = express(); 

const cors = require('cors'); 
app.use(cors({
    origin: "http://localhost:3000",
}
));

app.use(express.json());

app.use('/api', require('./Controllers/messages_controller')); 

app.get('/', (req, res)=>{
    res.status(200).send(`express get request to base URL @ http://localhost:${PORT}. Server standing by to fulfill requests from authorized client(s)`);
});

module.exports = app; 