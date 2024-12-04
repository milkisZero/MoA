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
        const { name, description, members, admin, location, phone, sns } = req.body;
        const clubImg = req.file ? req.file.location : null;

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

        newClub.msgRoomId = newMsgRoom._id;
        
        await Promise.all([newClub.save(), newMsgRoom.save()]);
        await User.updateMany(
            { _id: { $in: members }},
            { $addToSet: { 
                    clubs: newClub._id, 
                    msgRooms: newMsgRoom._id,
            }},
        );

        res.status(200).json({
            message: 'Club and Clubchatroom created successfully',
            newClub,
            newMsgRoom,
        });
    } catch (e) {
        console.log('post error in /club: ', e);
        res.status(500).json({
            message: 'Server post error in /club',
        });
    }
});

// 전체 동아리 목록 (미리보기)
router.get('/total_club', async (req, res) => {
    try {
        const { page, limit } = req.query;

        const [totalClubs, club] = await Promise.all([
            Club.countDocuments(),
            Club.aggregate([
                { $addFields: { memberCount: { $size: '$members' } }},
                { $sort: { memberCount: -1, createdAt: 1 }},
                { $skip: (Number(page) - parseInt(1, 10)) * Number(limit)},
                { $limit: Number(limit)},
            ]),
        ]);

        if (!club || totalClubs === 0)
            return res.status(404).json({ message: 'cannot found club list' });

        return res.status(200).json({
            message: `조회수 ${(page - 1) * limit + 1}위 부터 ${limit}개 list`,
            club,
            totalClubs
        });
    } catch (e) {
        console.log('get error in /club/total_club: ', e);
        return res.status(500).json({ message: 'Server get error in /club/total_club' });
    }
});

// 동아리 정보 보기
router.get('/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const foundClub = await Club.findById(clubId);
        if (!foundClub) return res.status(404).json({ message: 'cannot find clubId ' });

        return res.status(200).json({
            message: `find club`,
            foundClub,
        });
    } catch (e) {
        console.log('get error in /club/:clubId: ', e);
        return res.status(500).json({ message: 'Server get error in /club/:clubId' });
    }
});

// 동아리 세부정보 update (member 편집 제외)
router.put('/:clubId', upload.single('img'), async (req, res) => {
    try {
        const { name, description, img, location, phone, sns } = req.body;
        const newImg = req.file ? req.file.location : img;

        const updatedData = {
            name: name,
            description: description,
            clubImg: newImg,
            location: location,
            phone: phone,
            sns: sns,
        };

        const updatedClub = await Club.findByIdAndUpdate(req.params.clubId, updatedData, { new: true });

        if (!updatedClub) return res.status(404).json({ message: 'Club not found' });

        res.status(200).json({
            message: 'Club successfully updated',
            updatedClub,
        });
    } catch (e) {
        console.log('put error in /club/:clubId: ', e);
        return res.status(500).json({ message: 'Server put error in /club/:clubId' });
    }
});

// 동아리 멤버 추가
router.put('/members/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { members } = req.body;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        const newMembers = members.filter((member) => !club.members.includes(member));
        club.members.push(...newMembers);
        await club.save();

        await User.updateMany(
            { _id: { $in: newMembers } },
            { $addToSet: { 
                    clubs: clubId, 
                    msgRooms: club.msgRoomId 
            }},
        );

        return res.status(200).json({
            message: 'Members updated successfully',
            updatedClub: club,
        });
    } catch (e) {
        console.log('put error in /club/members/:clubId: ', e);
        return res.status(500).json({ message: 'Server put error in /club/members/:clubId' });
    }
});

// 동아리 멤버 삭제
router.delete('/members/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { members } = req.body;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        const deleteMembers = new Set(members.map(String));
        club.members = club.members.filter((member) => !deleteMembers.has(member.toString()));
        club.admin = club.admin.filter((member => !deleteMembers.has(member.toString())));

        if (club.admin.length === 0)
            return res.status(403).json({ message: 'Club must have at least one admin'});

        await club.save();
        await User.updateMany(
            { _id: { $in: members } },
            { $pull: {
                    clubs: clubId,
                    msgRooms: club.msgRoomId,
            }},
        );

        return res.status(200).json({
            message: 'Members removed successfully',
            updatedClub: club,
        });
    } catch (e) {
        console.log('delete error in /club/members/:clubId: ', e);
        return res.status(500).json({ message: 'Server delete error in /club/members/:clubId' });
    }
});

// 관리자 추가
router.put('/admin/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { admin } = req.body;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        const newAdmins = admin.filter((admin) => !club.admin.includes(admin));
        club.admin.push(...newAdmins);
        await club.save();

        return res.status(200).json({
            message: 'Club admin updated Successfully',
            updatedClub: club,
        });
    } catch (e) {
        console.log('put error in /club/admin/:clubId: ', e);
        return res.status(500).json({ message: 'Server put error in /club/admin/:clubId' });
    }
});

// 관리자 삭제
router.delete('/admin/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { admin } = req.body;

        const club = await Club.findById(clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        const deleteAdminSet = new Set(admin.map(String));
        club.admin = club.admin.filter(adminId => !deleteAdminSet.has(adminId.toString()));
        
        if (club.admin.length === 0)
            return res.status(403).json({ message: 'Club must have at least one admin'});

        await club.save();

        return res.status(200).json({
            message: 'Club admin delete successfully',
            updatedClub: club,
        });
    } catch (e) {
        console.log('delete error in /club/admin/:clubId: ', e);
        return res.status(500).json({ message: 'Server delete error in /club/admin/:clubId' });
    }
});

// 동아리 삭제
router.delete('/:clubId', async (req, res) => {
    try {
        const club = await Club.findByIdAndDelete(req.params.clubId);
        if (!club) return res.status(404).json({ message: 'cannot found Club' });

        const clubId = club._id;
        const msgRoomId = club.msgRoomId;

        await User.updateMany(
            { _id: { $in: club.members } },
            { $pull: { 
                clubs: clubId, 
                msgRooms: msgRoomId, 
            }}
        );

        await MsgRoom.findByIdAndDelete(msgRoomId);

        return res.status(200).json({
            message: 'Club successfully deleted',
            deletedClub: club,
        });
    } catch (e) {
        console.log('delete error in /club/:clubId: ', e);
        return res.status(500).json({ message: 'Server delete error in /club/:clubId' });
    }
});

// 동아리 가입 신청
router.post('/proposer/:clubId', async (req, res) => {
    try {
        const { userId } = req.body;
        const clubId = req.params.clubId;

        const [user, club] = await Promise.all([User.findById(userId), Club.findById(clubId)]);
        if (!user) return res.status(404).json({ message: 'User cannot found' });
        if (!club) return res.status(404).json({ message: 'Club cannot found' });

        const updateUserPromise = !user.waitingClubs.includes(clubId)
            ? User.updateOne(
                  { _id: userId },
                  { $addToSet: { waitingClubs: clubId } }
              )
            : null;

        const updateClubPromise = !club.proposers.includes(userId)
            ? Club.updateOne(
                  { _id: clubId },
                  { $addToSet: { proposers: userId } }
              )
            : null;

        await Promise.all([updateUserPromise, updateClubPromise]);

        res.status(200).json({
            message: 'Successfully proposered',
        });
    } catch (e) {
        console.log('post error in /club/proposer/:clubId: ', e);
        return res.status(500).json({ message: 'Server post error in /club/proposer/:clubId' });
    }
});

// 동아리 가입 신청자 목록
router.get('/proposer/:clubId', async (req, res) => {
    try {
        const club = await Club.findById(req.params.clubId).populate('proposers', '_id name');
        if (!club) return res.status(404).json({ message: 'cannot found Club' });

        res.status(200).json({
            message: 'successfully get proposer list: _id and name',
            proposers: club.proposers
        })
    } catch (e) {
        console.log('pogetst error in /club/proposer/:clubId: ', e);
        return res.status(500).json({ message: 'Server get error in /club/proposer/:clubId' });
    }
});

// 동아리 가입 (승인) 또는 (거절 및 취소)
router.post('/approve/:clubId', async (req, res) => {
    try {
        //approve는 boolean
        const { userId, approve } = req.body;
        const clubId = req.params.clubId;

        const [user, club] = await Promise.all([User.findById(userId), Club.findById(clubId)]);
        if (!user) return res.status(404).json({ message: 'User cannot found' });
        if (!club) return res.status(404).json({ message: 'Club cannot found' });

        const updateUser = {
            $pull: { waitingClubs: clubId },
            ...(approve && { $addToSet: { clubs: clubId, msgRooms: club.msgRoomId } }),
        };

        const updateClub = {
            $pull: { proposers: userId },
            ...(approve && { $addToSet: { members: userId } }),
        };

        await Promise.all([
            User.updateOne({ _id: userId }, updateUser),
            Club.updateOne({ _id: clubId }, updateClub),
        ]);

        res.status(200).json({
            message: approve ? 'Successfully approved' : 'Successfully rejected',
            updateUser,
            updateClub
        });
    } catch (e) {
        console.log('post error in /club/approve/:clubId: ', e);
        return res.status(500).json({ message: 'Server post error in /club/approve/:clubId' });
    }
});

// 동아리 검색

module.exports = router;
