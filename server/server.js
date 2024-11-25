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

const { Club } = require('./model/Club');
const { Post } = require('./model/Post');
const { User } = require('./model/User');
const { Event } = require('./model/Event');
const { Message } = require('./model/Message');
const { MsgRoom } = require('./model/MsgRoom');

// 회원가입
const bcrypt = require('bcrypt'); // 암호화 라이브러리
const saltRounds = 10; // 해쉬 난도
app.post('/api/user/register', async (req, res) => {
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
        return res.status(400).json({ success: false, err });
    }
});

// 로그인
const jwt = require('jsonwebtoken'); // 토큰 생성 라이브러리
app.post('/api/user/login', async (req, res) => {
    try {
        const found = await User.findOne({ email: req.body.email });
        if (!found) throw new Error('cannot find user');

        const match = await bcrypt.compare(req.body.password, found.password);
        if (!match) throw new Error('cannot match password');

        const token = jwt.sign(found._id.toHexString(), 'secretToken');
        const updated = await User.findOneAndUpdate(
            { email: req.body.email },
            { $set: { token: token } },
            { new: true }
        );

        // 쿠키에 토큰 저장?

        return res.status(200).json({
            success: true,
            updated,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 로그아웃

// 전체 동아리 목록 (미리보기)
app.get('/api/user/total_club', async (req, res) => {
    try {
        const { page, limit } = req.query; // 페이지 번호, 개수
        // 정렬 기준 추가?

        const club = Club.find()
            .sort({ createdAt: -1 }) //  정렬 기준
            .skip((page - 1) * limit) // 시작 지점
            .limit(Number(limit)); // 가져올 개수

        return res.status(200).json({
            success: true,
            club,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 검색

// 동아리 정보 보기
app.get('/api/user/club/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const foundCulb = await Club.findById({ id });

        return res.status(200).json({
            success: true,
            foundCulb,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 게시글보기

// 동아리 일정보기

// 마이페이지 - 일정보기

// 마이페이지 - 동아리보기

// 동아리 가입 신청
app.post('/api/club/proposer', async (req, res) => {
    try {
        const {userId, clubId} = req.body.query;
        if (!userId) throw new Error('cannot find user');
        if (!clubId) throw new Error('cannot find club');

        const wantUser = await User.findById(id);
        const wantedClub = await Club.findById(id);
        if (!wantUser) throw new Error('cannot find user');
        if (!wantedClub) throw new Error('cannot find club');

        if (!wantUser.waitingClubs.includes(clubId)) {
            wantUser.waitingClubs.push(clubId);
            await wantUser.save();
        }

        if (!wantedClub.proposers.includes(userId)) {
            wantedClub.proposers.push(userId);
            await wantedClub.save();
        }

        res.status(200).json(wantedClub);
    } catch (e) {
        console.log('error in /api/club/proposer : ', e);
        res.status(500);
    }
})

// 동아리 가입 (승인) 또는 (거절 및 취소)
app.post('api/club/approve', async (req, res) => {
    try {
        const {userId, clubId, approve} = req.body.query;
        if (!userId) throw new Error('cannot find user');
        if (!clubId) throw new Error('cannot find club');

        const wantUser = await User.findById(id);
        const wantedClub = await Club.findById(id);
        if (!wantUser) throw new Error('cannot find user');
        if (!wantedClub) throw new Error('cannot find club');

        if (wantUser.waitingClubs.includes(clubId)) {
            wantUser.waitingClubs.delete(clubId);
        }

        if (wantedClub.proposers.includes(userId)) {
            wantedClub.proposers.delete(userId);
        }

        if (approve) {
            wantedClub.members.push(userId);
        }

        await wantUser.save();
        await wantedClub.save();
        res.status(200).json(wantedClub);
    } catch (e) {
        console.log('error in /api/club/approve : ', e);
        res.status(500);
    }
})

// 동아리 일정 등록
app.post('/api/event', async(req, res) => {
    try {
        const newEvent = new Event({
            clubId: req.body.id,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location
        })
        
        await newEvent.save();
        res.status(200).json(newEvent);
    } catch (e) {
        console.log('error in /api/event : ', e);
        res.status(500);
    }
})

// 동아리 등록
app.post('/api/club', async(req, res) => {
    try {
        const newClub = new Event({
            name: req.body.id,
            description: req.body.title,
            members: [],
            admin: req.body.admin,
            proposers: [],
            postIds: [],
            events: [],
            createdAt: req.body.createdAt,
            location: req.body.location,
            phone: req.body.phone,
            date: req.body.date,
            sns: req.body.sns
        })
        
        await newClub.save();
        res.status(200).json(newClub);
    } catch (e) {
        console.log('error in /api/event : ', e);
        res.status(500);
    }
})

// 채팅 관련
// 동아리방
// 개인방
