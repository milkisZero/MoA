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
        res.send(200).json(newMsgRoom);
    } catch (e) {
        console.log('/api/msgRoom post error: ', e);
        res.send(400);
    }
})

// 채팅방 이름 변경
router.put('/msgRoomId', async (req, res) => {

})

module.exports = router;