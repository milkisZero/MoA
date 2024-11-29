const express = require('express');
const { User } = require('../model/User'); 
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

// 동아리 일정 등록
router.post('/', async (req, res) => {
    try {
        const { clubId, title, description, date, location } = req.body;
        const newEvent = new Event({
            clubId: clubId,
            title: title,
            description: description,
            date: date,
            location: location,
        });

        await newEvent.save();
        res.status(200).json(newEvent);
    } catch (e) {
        console.log('error in /api/event : ', e);
        res.status(500);
    }
});

module.exports = router;