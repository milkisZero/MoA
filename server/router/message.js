const express = require('express');
const { User } = require('../model/User'); 
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

router.put('/:msgId', async (req, res) => {
    try {
        const { content } = req.body;

        const updatedMsg = await Message.findByIdAndUpdate(
            req.params.msgId,
            { content: content },
            { new: true }
        )
        if (!updatedMsg)
            return res.status(404).json({ message: 'MsgRoom not found' });

        res.status(200).json({
            message: 'Modify message successfully',
            updatedMsg
        })
    } catch (e) {
        console.log('put error in /msg/:msgId :', e);
        res.status(500).json({ message: 'put error in /msg/:msgId' });
    }
})

router.delete('/:msgId', async (req, res) => {
    try {
        const msgId = req.params.msgId;
        const msg = await Message.findById(msgId);
        if (!msg) return res.status(404).json({ message: 'Message not found' });

        const msgRoom = await MsgRoom.findById(msg.msgRoomId);
        if (!msgRoom) return res.status(404).json({ message: 'MessageRoom not found' });

        const idx = msgRoom.messages.indexOf(msgId);
        if (idx > -1) msgRoom.messages.splice(idx, 1);
        await msgRoom.save();

        await Message.findByIdAndDelete(msgId);
        
        res.status(200).json({
            message: 'Delete message successfully'
        });
    } catch (e) {
        console.log('delete error in /msg/:msgId :', e);
        res.status(500).json({ message: 'delete error in /msg/:msgId' });
    }
})

module.exports = router;