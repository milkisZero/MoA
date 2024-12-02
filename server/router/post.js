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

// 동아리 게시글 등록
router.post('/:clubId', upload.single('img'), async (req, res) => {
    try {
        const { userId, title, content, clubImgs } = req.body;

        const posterId = await User.findById(userId);
        if (!posterId)
            return res.status(404).json({ message: 'Poster not found' });

        const club = await Club.findById(req.params.clubId);
        if (!club)
            return res.status(404).json({ message: 'Club not found' });

        if (!club.members.includes(userId))
            return res.status(403).json({ message: 'User is a not member of the club'});

        const newPost = new Post({
            clubId: req.params.clubId,
            title: title,
            content: content,
            postImgs: clubImgs,
        });
        await newPost.save();

        club.postIds.push(newPost._id);
        await club.save();
        
        return res.status(200).json({
            message: 'new Post successfully created',
            newPost
        });
    } catch (e) {
        console.log('post error in /post/:clubId: ', e);
        return res.status(500).json({ message: 'Server post error in /post/:clubId' });
    }
});

// 동아리 전체 게시글 보기
router.get('/:clubId/total_post', async (req, res) => {
    try {
        const clubId = req.params.clubId;
        const { page, limit } = req.query;

        const pageNumber = parseInt(page);
        const limitNumber = parseInt(limit);
        let idx = (pageNumber - 1) * Number(limitNumber);

        const foundCulb = await Club.findById(clubId);
        if (!foundCulb)
            return res.status(404).json({ message: 'Club not found' });

        const foundPostIds = foundCulb.postIds.slice(idx, idx + limitNumber);
        const posts = await Post.find({ _id: { $in: foundPostIds } });

        return res.status(200).json({
            message: 'Successfully found posts',
            posts,
        });
    } catch (e) {
        console.log('get error in /post/:clubId/total_post: ', e);
        return res.status(500).json({ message: 'Server get error in /post/:clubId/total_post' });
    }
});

// 동아리 게시글보기
router.get('/:postId', async (req, res) => {
    try {
        const postId = req.params.postId;
        const foundPost = await Post.findById(postId);
        if (!foundPost)
            return res.status(404).json({ message: 'Post not found' });

        return res.status(200).json({
            message: 'Successfully found a post',
            foundPost,
        });
    } catch (e) {
        console.log('get error in /post/:postId: ', e);
        return res.status(500).json({ message: 'Server get error in /post/:postId' });
    }
});

// 게시글 수정
router.put('/:postId', upload.single('img'),async (req, res) => {
    try {
        const { title, content, postImgs } = req.body;

        const postId = req.params.postId;
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: 'Post not found' });

        const updatedData = {
            title: title,
            content: content,
            updatedAt: Date.now(),
            postImgs: postImgs
        }

        const updatedPost = await Post.findByIdAndUpdate(
            postId,
            updatedData,
            { new: true },
        );

        return res.status(200).json({
            message: 'Successfully update a post',
            updatedPost,
        });
    } catch (e) {
        console.log('put error in /post/:postId: ', e);
        return res.status(500).json({ message: 'Server put error in /post/:postId' });
    }
});

// 게시글 삭제
router.delete('/:postId', async (req, res) => {
    try {
        const post = await Post.findById(req.params.postId);
        const club = await Club.findById(post.clubId);
        if (!club)
            return res.status(404).json({ message: 'Club not found '});

        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost)
            return res.status(404).json({ message: 'Post not found' });

        const idx = club.postIds.indexOf(req.params.postId);
        if (idx > -1) {
            club.postIds.splice(idx, 1);
            await club.save();
        }

        return res.status(200).json({
            message: 'Successfully delete Post',
            deletedPost
        })
    } catch (e) {
        console.log('delete error in /post/:postId: ', e);
        return res.status(500).json({ message: 'Server delete error in /post/:postId' });
    }
});

module.exports = router;