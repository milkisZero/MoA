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
            messages: []
        })

        await newMsgRoom.save();
        res.status(200).json({
            message: 'newMsgRoom created successfully',
            newMsgRoom
        });
    } catch (e) {
        console.log('post error in /msgRoom: ', e);
        res.status(500).json({ message: 'Server post error in /msgRoom' });
    }
});

// 채팅방 채팅 불러오기(페이지네이션)
router.get('/:msgRoomId', async (req, res) => {
    try {
        const { page, limit } = req.query;
        const pageNum = parseInt(page, 10);
        const limitNum = parseInt(limit, 10);

        const msgRoom = await MsgRoom.findById(req.params.msgRoomId);
        if (!msgRoom)
            return res.status(404).json({ message: 'MsgRoom cannot found' });

        const totalMessages = msgRoom.messages.length;
        let startIdx = totalMessages - pageNum * limitNum;
        let endIdx = totalMessages - (pageNum - 1) * limitNum;
        if (startIdx < 0) startIdx = 0;
        if (endIdx < 0) endIdx = 0;

        const length = endIdx - startIdx;
        const slicedMsg = msgRoom.messages.slice(startIdx, endIdx);
        const messages = await Promise.all(
            slicedMsg.map((msgId) => Message.findById(msgId))
        );

        res.status(200).json({
            message: 'Succefully get messages',
            messages,
            count: length
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
        const updatedMsgRoom = await MsgRoom.findByIdAndUpdate(
            req.params.msgRoomId,
            { name: name },
            { new: true }
        )
        if (!updatedMsgRoom)
            return res.status(404).json({ message: 'MsgRoom not found' });

        res.status(200).json({
            message: 'MsgRoom name updated successfully',
            updatedMsgRoom
        });
    } catch (e) {
        console.log('put error in /msgRoom/msgRoomId:', e);
        res.status(500).json({ message: 'put error in /msgRoom/msgRoomId' });
    }
});

// 채팅방 삭제
router.delete('/:msgRoomId', async (req, res) => {
    try {
        const msgRoom = await MsgRoom.findById(req.params.msgRoomId);
        if (!msgRoom)
            return res.status(404).json({ message: 'MsgRoom cannot found' });

        const messageId = msgRoom.messages;
        await Promise.all(messageId.map((msgId) => Message.findByIdAndDelete(msgId)));
        await MsgRoom.findByIdAndDelete(req.params.msgRoomId);

        res.status(200).json({ message: 'MsgRoom and Messages all deleted successfully' });
    } catch (e) {
        console.log('delete error in /msgRoom/msgRoomId:', e);
        res.status(500).json({ message: 'delete error in /msgRoom/msgRoomId' });
    }
});

module.exports = router;