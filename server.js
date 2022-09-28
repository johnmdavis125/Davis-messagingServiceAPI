const app = require('./src/app'); 
const PORT = process.env.PORT || 3001; 
const db = require('./src/database'); 

db.once('open', () => console.log('server connected to mongo'))
  .on('error', ()=>{
        console.warn('mongo cxn warning', error)
});

app.listen(PORT, ()=>{
    console.log(`Server awake and listening on PORT ${PORT}...`)
});