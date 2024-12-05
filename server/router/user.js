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

// 마이페이지 불러오기
router.get('/mypage/:userId', async (req, res) => {
    try {
        const user = await User.findById(req.params.userId);
        if (!user)
            return res.status(404).json({ message: 'User not found' });

        const clubs = await Club.find({ _id: { $in: user.clubs } })
            .select('_id name description clubImg events') 
            .populate('events')
            .lean(); 

        const msgRooms = await MsgRoom.find({ _id: { $in: user.msgRooms } })
            .select('_id name') 
            .lean();

        res.status(200).json({
            message: 'Successfully get mypage',
            clubs: clubs.map((club) => ({
                _id: club._id,
                name: club.name,
                description: club.description,
                clubImg: club.clubImg,
                events: club.events,
            })),
            msgRooms,
        })
    } catch (e) {
        console.log('get error in /user/mypage/:userId: ', e);
        return res.status(500).json({ message: 'Server get error in /user/mypage/:userId' });
    }
});

module.exports = router;