const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const cors = require('cors');
require('dotenv').config()
const port = process.env.PORT || 5000;
// meddke ware 
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.ixmy4.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function run(){
    try{
        await client.connect();
        const database = client.db('eman_Johon');
        const emaJhonDB = database.collection('products')
        const placeOrder = database.collections('orders')
        // load data 
        app.get('/products', async(req,res)=>{
            console.log(req.query)
            const curser = emaJhonDB.find({});
            const page = (req.query.page);
            const size = parseInt(req.query.size);
            let result;
            const count = await curser.count();
            if(page){
                result = await curser.skip(page*size).limit(size).toArray();
            }else{
                result = await curser.toArray();
            }
            
           
            res.send({
                count,
                result
            });
        })
        // use post 
        app.post('/products/bykes',async(req,res)=>{
            const keys  = req.body;
            const quary ={key: {$in: keys}}
            const user = await emaJhonDB.find(quary).toArray();
            res.json(user)
        })

        // post item 
        app.post('/order',async(req,res)=>{
            const order = req.body;
            console.log(order);
            res.send('got it')
        })
    }finally{
        // await client.close
    }
}
run().catch(console.dir);

app.get('/',(req,res)=>{
    res.send('got connected',)

})

app.listen(port,()=>{
    console.log('running port', port)
})