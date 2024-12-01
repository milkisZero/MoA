require('dotenv').config();

const { swaggerUi, specs } = require('./swagger.js');
const { MongoClient } = require('mongodb');
const mongoose = require('mongoose');
const express = require('express');
const cors = require('cors');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const { createServer } = require('http');
const { Server } = require('socket.io');

const app = express();
const server = createServer(app);
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
            maxAge: 1000 * 60 * 60 * 24,
            secure: false,
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
const postRoutes = require('./router/post');
const eventRoutes = require('./router/event');
const msgRoomRoutes = require('./router/msgRoom');
const messageRoutes = require('./router/message');

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
            const newMsg = new Message({
                msgRoomId,
                senderId,
                content
            });
            await newMsg.save();
            
            await MsgRoom.findByIdAndUpdate(
                msgRoomId,
                { $push: { messages: newMsg._id }},
            );

            socket.emit('receiveMsg', newMsg);
            console.log(`Message sent to ${msgRoomId}: ${content}`);
        } catch (e) {
            console.log('Message send error:', e);
            socket.emit('errorMessage', { error: 'Failed to send message.' });
        }
    })

    // 채팅방 퇴장
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
})

app.get('/api/session/', async (req, res) => {
    console.log(req.session);
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = await User.findById(req.session.userId);
    return res.status(200).json({
        message: 'Successfully user found',
        user
    });
});

app.use('/api/user', userRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/post', postRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/msgRoom', msgRoomRoutes);
app.use('/api/msg', messageRoutes);

connect();