const app = require('./src/app'); 

const db = require('./src/database'); 

db.once('open', () => console.log('server connected to mongo'))
  .on('error', ()=>{
        console.warn('mongo cxn warning', error)
});

app.listen(3001, ()=>{
    console.log('Server awake and listening on PORT 3001...')
});