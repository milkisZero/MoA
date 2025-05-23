const express = require('express');
const multer = require('multer');
const multerS3 = require('multer-s3');
const { S3Client, DeleteObjectCommand } = require('@aws-sdk/client-s3');

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
        accessKeyId: 'ACCESS_KEYID',
        secretAccessKey: 'SECRET_ACCESS_KEY',
    },
});

const upload = multer({
    storage: multerS3({
        s3: s3,
        bucket: 'moaprojects3',
        key: function (req, file, cb) {
            cb(null, Date.now().toString() + '_' + file.originalname);
        },
    }),
});

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

// 동아리 게시글 등록
router.post('/:clubId', upload.array('img', 10), async (req, res) => {
    try {
        const { userId, title, content } = req.body;
        const postImgs = req.files ? req.files.map((file) => file.location) : null;
        
        const club = await Club.findById(req.params.clubId);
        if (!club)
            return res.status(404).json({ message: 'Club not found' });

        if (!club.admin.includes(userId))
            return res.status(403).json({ message: 'BeomBu cannot make post'});

        const newPost = new Post({
            clubId: req.params.clubId,
            title: title,
            content: content,
            postImgs: postImgs,
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
router.put('/:clubId/:postId', upload.array('img', 10),async (req, res) => {
    try {
        const { userId, title, content, existingImgs, deletedImgs } = req.body;

        const club = await Club.findById(req.params.clubId);
        if (!club)
            return res.status(404).json({ message: 'Club not found' });

        if (!club.admin.includes(userId))
            return res.status(403).json({ message: 'BeomBu cannot modify post'});

        const existingPost = await Post.findById(req.params.postId);
        if (!existingPost)
            return res.status(404).json({ message: 'Post not found' });

        const updatedImgs = [
            ...(Array.isArray(existingImgs) ? existingImgs : [existingImgs].filter(Boolean)),
            ...req.files.map((file) => file.location),
        ];

        const updatedData = {
            title: title,
            content: content,
            updatedAt: Date.now(),
            postImgs: updatedImgs
        };

        const updatedPost = await Post.findByIdAndUpdate(
            req.params.postId,
            updatedData,
            { new: true },
        );

        if (deletedImgs) {
            const imagesToDelete = Array.isArray(deletedImgs) ? deletedImgs : [deletedImgs];
            imagesToDelete.forEach(async (img) => {
                const key = img.split('/').pop();
                await s3.deleteObject({ Bucket: 'moaprojects3', Key: key }).promise();
            });
        }

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
router.delete('/:clubId/:postId', async (req, res) => {
    try {
        const { userId } = req.body;
        
        const club = await Club.findById(req.params.clubId);
        if (!club)
            return res.status(404).json({ message: 'Club not found '});
        
        if (!club.admin.includes(userId))
            return res.status(403).json({ message: 'BeomBu cannot delete post'});

        const deletedPost = await Post.findByIdAndDelete(req.params.postId);
        if (!deletedPost)
            return res.status(404).json({ message: 'Post not found' });
        
        await Club.updateOne(
            { _id: req.params.clubId },
            { $pull: { postIds: req.params.postId } }
        );

        if (Array.isArray(deletedPost.postImgs) && deletedPost.postImgs.length > 0) {
            const deleteImagePromises = deletedPost.postImgs.map(async (img) => {
                const key = img.split('/').pop();
                console.log(`Deleting image: ${key}`);
                try {
                    await s3.deleteOne({
                        Bucket: 'moaprojects3',
                        Key: key,
                    }).promise();
                } catch (err) {
                    console.error(`Failed to delete image: ${key}`, err);
                }
            });
            await Promise.all(deleteImagePromises);
        };

        return res.status(200).json({
            message: 'Successfully delete Post',
            club,
            deletedPost
        });
    } catch (e) {
        console.log('delete error in /post/:postId: ', e);
        return res.status(500).json({ message: 'Server delete error in /post/:postId' });
    }
});

module.exports = router;