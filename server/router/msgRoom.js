const express = require('express');
const { User } = require('../model/User');
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

// 채팅방 생성
router.post('/', async (req, res) => {
    try {
        const { name, members } = req.body;
        const newMsgRoom = new MsgRoom({
            name: name,
            members: members,
            messages: [],
        });

        await newMsgRoom.save();
        await User.updateMany(
            { _id: { $in: members }},
            { $addToSet: { msgRooms: newMsgRoom._id }},
        );

        res.status(200).json({
            message: 'newMsgRoom created successfully',
            newMsgRoom,
        });
    } catch (e) {
        console.log('post error in /msgRoom: ', e);
        res.status(500).json({ message: 'Server post error in /msgRoom' });
    }
});

router.get('/name/:msgRoomId', async (req, res) => {
    try {
        const msgRoom = await MsgRoom.findById(req.params.msgRoomId);
        if (!msgRoom) return res.status(404).json({ message: 'Chat room not found' });
        
        res.status(200).json({
            message: 'MsgRoom name get successfully',
            name: msgRoom.name
        })
    } catch (e) {
        console.log('get error in /msgRoom/name/msgRoomId:', e);
        res.status(500).json({ message: 'get error in /msgRoom/name/msgRoomId' });
    }
})

// 채팅방 유저 불러오기
router.get('/users/:msgRoomId', async (req, res) => {
    try {
        const msgRoomId = req.params.msgRoomId;
        const msgRoom = await MsgRoom.findById(msgRoomId).populate('members', 'name');

        if (!msgRoom) return res.status(404).json({ message: 'Chat room not found' });

        res.status(200).json({
            message: 'Users retrieved successfully',
            members: msgRoom.members,
        });
    } catch (e) {
        console.log('get error in /msgRoom/users/msgRoomId:', e);
        res.status(500).json({ message: 'get error in /msgRoom/users/msgRoomId' });
    }
});

// 채팅방 채팅 불러오기(페이지네이션)
router.get('/:msgRoomId', async (req, res) => {
    try {
        const { msgId } = req.query;
        const limit = 10;

        const msgRoom = await MsgRoom.findById(req.params.msgRoomId).lean();
        if (!msgRoom) return res.status(404).json({ message: 'MsgRoom cannot found' });

        const endIdx = msgId ? msgRoom.messages.indexOf(msgId) : msgRoom.messages.length;
        if (endIdx === -1) return res.status(404).json({ message: 'Message cannot found' });
        const startIdx = Math.max(0, endIdx - limit);

        const slicedMsg = msgRoom.messages.slice(startIdx, endIdx).reverse();
        const messages = await Promise.all(slicedMsg.map((msgId) => Message.findById(msgId)));

        res.status(200).json({
            message: 'Succefully get messages',
            messages,
        });
    } catch (e) {
        console.log('get error in /msgRoom/msgRoomId:', e);
        res.status(500).json({ message: 'get error in /msgRoom/msgRoomId' });
    }
});

// 채팅방 이름 변경
router.put('/:msgRoomId', async (req, res) => {
    try {
        const { name } = req.body;
        const updatedMsgRoom = await MsgRoom.findByIdAndUpdate(req.params.msgRoomId, { name: name }, { new: true });
        if (!updatedMsgRoom) return res.status(404).json({ message: 'MsgRoom not found' });

        res.status(200).json({
            message: 'MsgRoom name updated successfully',
            updatedMsgRoom,
        });
    } catch (e) {
        console.log('put error in /msgRoom/msgRoomId:', e);
        res.status(500).json({ message: 'put error in /msgRoom/msgRoomId' });
    }
});

// 채팅방 삭제
router.delete('/:msgRoomId', async (req, res) => {
    try {
        const msgRoomId = req.params.msgRoomId;
        const msgRoom = await MsgRoom.findById(msgRoomId);
        if (!msgRoom) return res.status(404).json({ message: 'MsgRoom cannot found' });

        await Message.deleteMany({ _id: { $in: msgRoom.messages } });
        await MsgRoom.findByIdAndDelete(msgRoomId);
        await User.updateMany(
            { _id: { $in: msgRoom.members } },
            { $pull: { msgRooms: msgRoomId } }
        );

        res.status(200).json({ message: 'MsgRoom and Messages all deleted successfully' });
    } catch (e) {
        console.log('delete error in /msgRoom/msgRoomId:', e);
        res.status(500).json({ message: 'delete error in /msgRoom/msgRoomId' });
    }
});

module.exports = router;
