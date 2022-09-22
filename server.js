const app = require('./src/app'); 

const cors = require('cors'); 
app.use(cors({
    origin: "http://localhost:3000",
    }
));

app.listen(3001, ()=>{
    console.log('Server awake and listening on PORT 3001...')
});