const express = require('express');
const bcrypt = require('bcrypt');
const { User } = require('../model/User'); 
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

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

        const saved = await user.save();
        return res.status(200).json({
            success: true,
            saved,
        });
    } catch (err) {
        console.log('error in /user/register: ', err);
        return res.status(400).json({ success: false, err });
    }
});

// 로그인
router.post('/login', async (req, res) => {
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
        console.log('error in /user/login: ', err);
        return res.status(400).json({ success: false, err });
    }
});

// 로그아웃
router.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            console.log('error in /user/logout:', err);
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


// 마이페이지 - 일정보기
router.get('/mypage/event', async (req, res) => {
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
        console.log('error in /mypage/event: ', err);
        return res.status(400).json({ success: false, err });
    }
});

// 마이페이지 - 동아리보기
router.get('/mypage/club', async (req, res) => {
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
        console.log('error in /mypage/club: ', err);
        return res.status(400).json({ success: false, err });
    }
});

module.exports = router;