const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const PORT = 8080;

app.use(express.json());
app.use(cors());

let db;
const dburl = '[DB_URL] MongoClient(dburl).connect().then((client) => {    
    db = client.db('forum');
    console.log('Successfully Connected DB');
    
    app.listen(PORT, function () {
        console.log(`MOA 서버 실행. Port : ${PORT}`);
    }); 
}).catch((err)=>{
    console.log('db 연결 실패');
})

app.get('/dbtest', (req, res) => {
    db.collection('post').insertOne({title : 'test'});
    res.send('db test');
})