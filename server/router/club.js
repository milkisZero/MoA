const express = require('express');
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

// 동아리 등록
router.post('/', upload.single('img'), async (req, res) => {
    try {
        const { name, description, members, admin, clubImg, location, phone, sns } = req.body;
        const newClub = new Club({
            name: name,
            description: description,
            members: members,
            admin: admin,
            clubImg: clubImg,
            location: location,
            phone: phone,
            sns: sns,
        });

        const newMsgRoom = new MsgRoom({
            name: name,
            members: members,
        });

        await newClub.save();
        await newMsgRoom.save();

        res.status(200).json({
            message: 'Club and Clubchatroom created successfully',
            newClub,
            newMsgRoom
        });
    } catch (e) {
        console.log('post error in /api/club: ', e);
        res.status(500).json({
            message: 'Server post error in /api/club'
        });
    }
});

// 전체 동아리 목록 (미리보기)
router.get('/total_club', async (req, res) => {
    try {
        const { page, limit } = req.query; // 페이지 번호, 개수
        // 정렬 기준 추가?
        const club = await Club.find()
            .sort({ createdAt: -1 }) //  정렬 기준
            .skip((page - 1) * limit) // 시작 지점
            .limit(Number(limit)); // 가져올 개수
        if (!club) return res.status(404).json({ message: 'cannot found club list' });

        return res.status(200).json({
            message: `조회수 ${(page-1) * limit + 1}위 부터 ${limit}개 list`,
            club,
        });
    } catch (err) {
        console.log('get error in /club/total_club: ', err);
        return res.status(500).json({ message: 'Server get error in /club/total_club' });
    }
});

// 동아리 정보 보기
router.get('/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const foundCulb = await Club.findById(clubId);
        if (!foundCulb)
            return res.status(404).json({ message: 'cannot find clubId '});

        return res.status(200).json({
            message: `find club`,
            foundCulb,
        });
    } catch (err) {
        console.log('get error in /club/:clubId: ', err);
        return res.status(500).json({ message: 'Server get error in /club/:clubId' });
    }
});

// 동아리 세부정보 update
router.put('/:clubId', upload.single('img'), async (req, res) => {
    try {
        const { name, description, members, admin, clubImg, location, phone, sns } = req.body;
        
        const updatedData = {
            name: name,
            description: description,
            members: members,
            admin: admin,
            clubImg: clubImg,
            location: location,
            phone: phone,
            sns: sns
        };

        const updatedClub = await Club.findByIdAndUpdate(
            req.params.clubId,
            updatedData,
            { new: true },
        );

        if (!updatedClub)
            return res.status(404).json({ message: 'Club not found' });

        res.status(200).json({
            message: 'Club successfully updated',
            updatedClub,
        })

    } catch (e) {
        console.log('put error in /club/:clubId: ', err);
        return res.status(500).json({ message: 'Server put error in /club/:clubId' });
    }
})

// 동아리 삭제
router.delete('/:clubId', async (req, res) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.clubId);
        if (!club) return res.status(404).json({ message: 'cannot found Club'});

        console.log(club);
        return res.status(200).json({
            message: 'Club successfully deleted',
            club
        });
    } catch (e) {
        console.log('delete error in /club/:clubId: ', err);
        return res.status(500).json({ message: 'Server delete error in /club/:clubId' });
    }
})

// 동아리 전체 게시글 보기
router.get('/:clubId/total_post', async (req, res) => {
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
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
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
router.get('/:clubId/event', async (req, res) => {
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

// 동아리 가입 신청
router.post('/proposer', async (req, res) => {
    try {
        const { userId, clubId } = req.body;
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
        console.log('error in /proposer : ', e);
        res.status(500);
    }
});

// 동아리 가입 (승인) 또는 (거절 및 취소)
router.post('/approve', async (req, res) => {
    try {
        const { userId, clubId, approve } = req.body;
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
        console.log('error in /approve : ', e);
        res.status(500);
    }
});

// 동아리 검색

module.exports = router;