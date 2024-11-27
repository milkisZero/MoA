require('dotenv').config();

const { swaggerUi, specs } = require('./swagger.js');
const { S3Client } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const path = require('path');
const yaml = require('yamljs');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multerS3 = require('multer-s3');
const session = require('express-session');
const MongoStore = require('connect-mongo');

const app = express();
const PORT = 8080;
const dburl =
    '[DB_URL] origin: 'http://localhost:3000', credentials: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: '[SECRET]',
        cookie: {
            httpOnly: true,
            sameSite: 'none',
            maxAge: 1000 * 60,
        }, // 24시간 세션 유지
        store: MongoStore.create({
            mongoUrl: dburl,
            dbName: 'test',
        }),
    })
);

async function connect() {
    await mongoose.connect(dburl);
    console.log('Successfully Connected DB');
}
connect();
app.listen(PORT, () => {
    console.log(`서버 실행. Port : ${PORT}`);
});

const { Club } = require('./model/Club');
const { Post } = require('./model/Post');
const { User } = require('./model/User');
const { Event } = require('./model/Event');
const { Message } = require('./model/Message');
const { MsgRoom } = require('./model/MsgRoom');

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: '[ACCESS_KEYID]',
        secretAccessKey: '[SECRET_ACCESS_KEY]',
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'moaprojects3',
        key: function (req, file, cb) {
            cb(null, Date.now().toString());
        },
    }),
});

app.get('/api/session/', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.status(200).json();
});

// 회원가입
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
        console.log('/api/user/register post error: ', err);
        return res.status(400).json({ success: false, err });
    }
});

// 로그인
app.post('/api/user/login', async (req, res) => {
    try {
        const found = await User.findOne({ email: req.body.email });
        if (!found) throw new Error('cannot find user');

        const match = await bcrypt.compare(req.body.password, found.password);
        if (!match) throw new Error('cannot match password');

        req.session.userId = found._id;

        return res.status(200).json({
            success: true,
            found,
        });
    } catch (err) {
        console.log('/api/user/login post error: ', err);
        return res.status(400).json({ success: false, err });
    }
});

// 로그아웃
app.post('/api/user/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('/api/user/logout error:', err);
            return res.status(500).json({
                success: false,
                message: 'Logout Failed',
            });
        }

        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({
            success: true,
            message: 'Logout Successful',
        });
    });
});

// 전체 동아리 목록 (미리보기)
app.get('/api/total_club', async (req, res) => {
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
app.get('/api/club/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const foundCulb = await Club.findById({ clubId });

        return res.status(200).json({
            success: true,
            foundCulb,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 전체 게시글 보기
app.get('/api/club/:clubId/total_post', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { page, limit } = req.query;
        let idx = (page - 1) * Number(limit);

        const foundCulb = await Club.findById({ clubId });
        const foundPostId = foundCulb.postIds.slice(idx, idx + Number(limit));
        const posts = await Post.find({ _id: { $in: foundPostId } });

        return res.status(200).json({
            success: true,
            posts,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 게시글보기
app.get('/api/club/:postId', async (req, res) => {
    try {
        const postId = req.params.id;
        const foundPost = await Post.findById({ postId });

        return res.status(200).json({
            success: true,
            foundPost,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 일정보기
app.get('/api/club/:clubId/event', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { year, month } = req.query;

        const foundEvents = await Event.find({
            clubId: clubId,
            date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(month === '12' ? `${year + '1'}-${month}-01` : `${year}-${month + '1'}-01`),
            },
        });

        return res.status(200).json({
            success: true,
            foundEvents,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 마이페이지 - 일정보기
app.get('/api/user/mypage/event', async (req, res) => {
    try {
        const { userId, year, month } = req.body;

        const foundUser = await User.findById({ userId });
        const foundEvents = await Event.find({
            _id: { $in: foundUser.events },
            date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(month === '12' ? `${year + '1'}-${month}-01` : `${year}-${month + '1'}-01`),
            },
        });

        return res.status(200).json({
            success: true,
            foundEvents,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 마이페이지 - 동아리보기
app.get('/api/user/mypage/club', async (req, res) => {
    try {
        const { userId, page, limit } = req.body;

        const foundUser = await User.findById({ userId });
        const foundClub = Club.find({ _id: { $in: foundUser.clubs } })
            .skip((page - 1) * limit)
            .limit(Number(limit));

        return res.status(200).json({
            success: true,
            foundClub,
        });
    } catch (err) {
        return res.status(400).json({ success: false, err });
    }
});

// 동아리 가입 신청
app.post('/api/club/proposer', async (req, res) => {
    try {
        const { userId, clubId } = req.body.query;
        if (!userId) throw new Error('cannot find user');
        if (!clubId) throw new Error('cannot find club');

        const wantUser = await User.findById(userId);
        const wantedClub = await Club.findById(clubId);
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
});

// 동아리 가입 (승인) 또는 (거절 및 취소)
app.post('api/club/approve', async (req, res) => {
    try {
        const { userId, clubId, approve } = req.body.query;
        if (!userId) throw new Error('cannot find user');
        if (!clubId) throw new Error('cannot find club');

        const wantUser = await User.findById(userId);
        const wantedClub = await Club.findById(clubId);
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
});

// 동아리 일정 등록
app.post('/api/event', async (req, res) => {
    try {
        const newEvent = new Event({
            clubId: req.body.id,
            title: req.body.title,
            description: req.body.description,
            date: req.body.date,
            location: req.body.location,
        });

        await newEvent.save();
        res.status(200).json(newEvent);
    } catch (e) {
        console.log('error in /api/event : ', e);
        res.status(500);
    }
});

// 동아리 등록
app.post('/api/club', async (req, res) => {
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
            sns: req.body.sns,
        });

        await newClub.save();
        res.status(200).json(newClub);
    } catch (e) {
        console.log('error in /api/event : ', e);
        res.status(500);
    }
});

// 채팅 관련
// 동아리방
// 개인방

app.post('/api/club/:clubId/post', upload.single('img'), async (req, res) => {
    try {
        const newPost = new Post({
            clubId: req.params.clubId,
            title: req.body.title,
            content: req.body.content,
            img: req.file.location,
        });
        await newPost.save();
        res.status(200).json(newPost);
    } catch (e) {
        console.log('error in /api/club/:clubId/post : ', e);
        res.status(500);
    }
});
