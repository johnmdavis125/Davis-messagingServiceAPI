const app = require('./src/app'); 
const db = require('./src/database'); 

const cors = require('cors'); 
app.use(cors({
    origin: "http://localhost:3000",
    }
));

db.on('open', ()=>{
    console.log('connected to Mongo')
});

app.listen(3001, ()=>{
    console.log('Server awake and listening on PORT 3001...')
});