const express = require('express');
const bcrypt = require('bcrypt');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client } = require('@aws-sdk/client-s3');

const { User } = require('../model/User'); 
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

const s3 = new S3Client({
    region: 'ap-northeast-2',
    credentials: {
        accessKeyId: 'ACCESS_KEYID',
        secretAccessKey: 'SECRET_ACCESS_KEY',
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

// 회원가입
const saltRounds = 10; // 해쉬 난도
router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // 암호화
        const salt = await bcrypt.genSalt(saltRounds);
        const hashed = await bcrypt.hash(password, salt);

        const user = new User({
            name,
            email,
            password: hashed,
        });

        const newUser = await user.save();
        return res.status(200).json({
            message: "Succesfully register",
            newUser,
        });
    } catch (e) {
        console.log('post error in /user/register: ', e);
        return res.status(500).json({ message: 'User create Faild. Server post error in /user/register' });
    }
});

// 로그인
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email: email });
        if (!user) return res.status(404).json({ message: 'User cannot found'});

        const match = await bcrypt.compare(password, user.password);
        if (!match) return res.status(403).json({ message: 'Password not matched'});

        req.session.userId = user._id;

        return res.status(200).json({
            message: "Login successfully",
            user,
        });
    } catch (e) {
        console.log('post error in /user/login: ', e);
        return res.status(500).json({ message: 'Login failed. Server post error in /user/login' });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((e) => {
        if (e) {
            console.log('post error in /user/logout: ', e);
            return res.status(500).json({ message: 'Logout Failed. Server post error in /user/logout' });
        }

        res.clearCookie('connect.sid', { path: '/' });
        res.status(200).json({ message: 'Logout Successfully' });
    });
});

// 프로필 사진 수정
router.put('/:userId', upload.single('img'), async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user)
            return res.status(403).json({ message: 'User not found' });

        const url = req.file.location;
        user.profileImg = url;
        await user.save();

        res.status(200).json({
            message: 'Successfully changed profileImg',
            profileImg: url,
        })
    } catch (e) {
        console.log('put error in /user/:userId: ', e);
        return res.status(500).json({ message: 'Server get error in /user/:userId' });
    }
});

// 마이페이지 불러오기 (일정 제외)
router.get('/mypage/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const clubs = await Club.find({ _id: { $in: user.clubs } })
            .select('_id name description clubImg events msgRoomId') 
            .populate('events')
            .lean(); 

        const msgRooms = await MsgRoom.find({ 
                _id: { $in: user.msgRooms }, 
                qnaRoomId: { $exists: true } 
            }).select('_id name').lean();

        res.status(200).json({
            message: 'Successfully get mypage',
            user,
            clubs: clubs.map((club) => ({
                _id: club._id,
                name: club.name,
                description: club.description,
                clubImg: club.clubImg,
                msgRoomId: club.msgRoomId,
                events: club.events,
            })),
            msgRooms,
        })
    } catch (e) {
        console.log('get error in /user/mypage/:userId: ', e);
        return res.status(500).json({ message: 'Server get error in /user/mypage/:userId' });
    }
});

// 마이페이지 일정 불러오기
router.get('/event/:userId', async (req, res) => {
    try {
        let { year, month } = req.query;

        const user = await User.findById(req.params.userId);
        if (!user) return res.status(404).json({ message: 'User cannot found'});

        year = parseInt(year, 10);
        month = parseInt(month, 10);
         
        const startMonth = month - 1 < 1 ? month+11 : month-1;
        const startYear = month - 1 < 1 ? year-1 : year;

        const endMonth = month + 2 > 12 ? month-10: month+2;
        const endYear = month + 2 > 12 ? year+1 : year;

        const startDate = new Date(`${startYear}-${startMonth}-01`);
        const endDate = new Date(`${endYear}-${endMonth}-01`);

        const foundEvents = await Event.find({
            clubId: { $in: user.clubs },
            date: {
                $gte: startDate,
                $lt: endDate,
            },
        });

        return res.status(200).json({
            message: "Successfully get mypage club event list",
            foundEvents,
        });
    } catch (e) {
        console.log('get error in /user/event/:userId: ', e);
        return res.status(500).json({ message: 'Server get error in /user/event/:userId' });
    }
});

module.exports = router;