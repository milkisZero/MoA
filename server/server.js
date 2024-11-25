const express = require('express');
const path = require('path');
const app = express();
const cors = require('cors');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const PORT = 8080;

app.use(express.json());
app.use(cors());

let db;
const dburl =
    '[DB_URL] new MongoClient(dburl)
//     .connect()
//     .then((client) => {
//         db = client.db('forum');
//         console.log('Successfully Connected DB');

//         app.listen(PORT, function () {
//             console.log(`MOA 서버 실행. Port : ${PORT}`);
//         });
//     })
//     .catch((err) => {
//         console.log('db 연결 실패');
//     });

async function connect() {
    await mongoose.connect(dburl, { useUnifiedTopology: true, useNewUrlParser: true });
    console.log('Successfully Connected DB');
}
connect();
app.listen(PORT, () => {
    console.log(`서버 실행. Port : ${PORT}`);
});

// app.get('/dbtest', (req, res) => {
//     db.collection('post').insertOne({ title: 'test' });
//     res.send('db test');
// });

const { Club } = require('../model/Club');
const { User } = require('../model/User');
const { Post } = require('../model/Post');
const { Event } = require('../model/Event');
const { Message } = require('../model/Message');
const { MsgRoom } = require('../model/MsgRoom');

// 회원가입
const bcrypt = require('bcrypt'); // 암호화 라이브러리
const saltRounds = 10; // 해쉬 난도

app.post('/api/users/register', async (req, res) => {
    try {
        const user = new User(req.body);

        // 암호화
        const salt = await bcrypt.genSalt(saltRounds);
        user.password = await bcrypt.hash(user.password, salt);

        const saved = await user.save();
        return res.status(200).json({
            success: true,
            saved,
        });
    } catch (err) {
        return res.json({ success: false, err });
    }
});
