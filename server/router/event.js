const express = require('express');
const { User } = require('../model/User');
const { Event } = require('../model/Event');
const { Club } = require('../model/Club');
const { Post } = require('../model/Post');
const { MsgRoom } = require('../model/MsgRoom');
const { Message } = require('../model/Message');

const router = express.Router();

const binarySearch = (arr, target) => {
    let left = 0;
    let right = arr.length - 1;

    while (left <= right) {
        const mid = Math.floor((left + right) / 2);
        if (arr[mid] === target) {
            return mid;
        } else if (arr[mid] < target) {
            left = mid + 1;
        } else {
            right = mid - 1;
        }
    }
    return -1;
};

// 동아리 일정 등록
router.post('/:clubId', async (req, res) => {
    try {
        const { userId, title, description, date, location } = req.body;

        const club = await Club.findById(req.params.clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (!club.admin.includes(userId)) return res.status(403).json({ message: 'BeomBu cannot post event' });

        const newEvent = new Event({
            clubId: req.params.clubId,
            title: title,
            description: description,
            date: date,
            location: location,
        });
        await newEvent.save();

        club.events.push(newEvent._id);
        await club.save();

        res.status(200).json({
            message: 'Event successfully created',
            newEvent,
        });
    } catch (e) {
        console.log('post error in /event/:clubId: ', e);
        return res.status(500).json({ message: 'Server post error in /event/:clubId' });
    }
});

// 동아리 한달 일정보기
router.get('/:clubId', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { year, month } = req.query;

        const foundEvents = await Event.find({
            clubId: clubId,
            date: {
                $gte: new Date(`${year}-${month}-01`),
                $lt: new Date(
                    month === '12' ? `${parseInt(year) + 1}-${month}-01` : `${year}-${parseInt(month) + 1}-01`
                ),
            },
        });

        return res.status(200).json({
            message: 'Events successfully found',
            foundEvents,
        });
    } catch (e) {
        console.log('get error in /event/:clubId: ', e);
        return res.status(500).json({ message: 'Server get error in /event/:clubId' });
    }
});

// 동아리 일정 수정
router.put('/:clubId/:eventId', async (req, res) => {
    try {
        const { userId, title, description, date, location } = req.body;
        if (!userId) return res.status(404).json({ message: 'userId not enclosed' });

        const club = await Club.findById(req.params.clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (!club.admin.includes(userId)) return res.status(403).json({ message: 'BeomBu cannot modify event' });

        const updatedData = {
            title: title,
            description: description,
            date: date,
            location: location,
        };

        const updatedEvent = await Event.findByIdAndUpdate(req.params.eventId, updatedData, { new: true });

        if (!updatedEvent) return res.status(404).json({ message: 'Event not found' });

        return res.status(200).json({
            message: 'Successfully update a event',
            updatedEvent,
        });
    } catch (e) {
        console.log('put error in /event/:clubId: ', e);
        return res.status(500).json({ message: 'Server put error in /event/:clubId' });
    }
});

// 동아리 일정 삭제
router.delete('/:clubId/:eventId', async (req, res) => {
    try {
        const { userId } = req.body;

        const club = await Club.findById(req.params.clubId);
        if (!club) return res.status(404).json({ message: 'Club not found' });

        if (!club.admin.includes(userId)) return res.status(403).json({ message: 'BeomBu cannot delete event' });

        const deletedEvent = await Event.findByIdAndDelete(req.params.eventId);
        if (!deletedEvent) return res.status(404).json({ message: 'Event not found' });

        const events = club.events;
        const idx = binarySearch(events, req.params.eventId);
        if (idx > -1) {
            events.splice(idx, 1);
            await Club.updateOne(
                { _id: club._id },
                { events: events }
            );
        };

        return res.status(200).json({
            message: 'Event successfully delete',
            deletedEvent,
        });
    } catch (e) {
        console.log('delete error in /event/:clubId: ', e);
        return res.status(500).json({ message: 'Server delete error in /event/:clubId' });
    }
});

module.exports = router;
