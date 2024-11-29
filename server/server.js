require('dotenv').config();

const { swaggerUi, specs } = require('./swagger.js');
const { S3Client } = require('@aws-sdk/client-s3');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const multer = require('multer');
const multerS3 = require('multer-s3');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createServer } = require('http');
const { Server } = require('socket.io');
const server = createServer(app);

const app = express();
const PORT = 8080;
const dburl =
    '[DB_URL] origin: 'http://localhost:3000', credentials: true }));
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
app.use(
    session({
        resave: false,
        saveUninitialized: false,
        secret: '[SECRET]',
        cookie: {
            httpOnly: true,
            sameSite: 'Strict',
            maxAge: 1000 * 60,
        }, // 24시간 세션 유지
        store: MongoStore.create({
            mongoUrl: dburl,
            dbName: 'test',
        }),
    })
);

const { Club } = require('./model/Club');
const { Post } = require('./model/Post');
const { User } = require('./model/User');
const { Event } = require('./model/Event');
const { Message } = require('./model/Message');
const { MsgRoom } = require('./model/MsgRoom');

const userRoutes = require('./router/user');
const clubRoutes = require('./router/club');
const eventRoutes = require('./router/event');
const msgRoomRoutes = require('./router/msgRoom');

async function connect() {
    try {
        await mongoose.connect(dburl)
        console.log('Successfully Connected DB');
    
        server.listen(PORT, () => {
            console.log(`서버 실행. Port : ${PORT}`);
        });
    } catch (e) {
        console.log('connect error : ', e);
    }
}

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

const io = new Server(server, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST'],
        credentials: true,
    },
});

// 실시간 채팅(socket)
io.on('connection', (socket) => {
    console.log('connected websocket:', socket.id);

    // 채팅방 입장
    socket.on('joinRoom', ({ msgRoomId }) => {
        socket.join(msgRoomId);
        console.log(`Socket ${socket.id} joined room: ${msgRoomId}`);
    })

    // 메세지 broadcast
    socket.on('sendMsg', async ({msgRoomId, senderId, content}) => {
        try {
            const newMsg = new Message( {
                msgRoomId,
                senderId,
                content
            });
            await newMsg.save();
            
            await MsgRoom.findByIdAndUpate(
                msgRoomId,
                { $push: { mesage: newMsg._id }},
            );

            socket.to(msgRoomId).emit('receiveMsg', {
                msgRoomId,
                senderId,
                content,
                timestamp: newMsg.timestamp
            });

            console.log(`Message sent to ${msgRoomId}: ${content}`);
        } catch (e) {
            console.error('Message send error:', e);
            socket.emit('errorMessage', { error: 'Failed to send message.' });
        }
    })

    // 채팅방 퇴장
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
})

app.get('/api/session/', (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    return res.status(200).json();
});

app.use('/api/user', userRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/msgRoom', msgRoomRoutes);

connect();

module.exports = { upload };