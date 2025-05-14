require('dotenv').config();

const express = require('express');
const cors = require('cors');
const { createServer } = require('http');
const { Server } = require('socket.io');
const { Message } = require('./model/Message');
const { MsgRoom } = require('./model/MsgRoom');
const mongoose = require('mongoose');

const app = express();
const server = createServer(app);
const PORT = 8081;
const dburl =
    'DB_URL';

app.use(express.json());
app.use(cors({ origin: true, credentials: true }));

const io = new Server(server, {
    cors: {
        origin: true,
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
    });

    // 메세지 broadcast
    socket.on('sendMsg', async ({ senderName, senderId, msgRoomId, content }) => {
        try {
            const newMsg = new Message({
                senderName,
                senderId,
                msgRoomId,
                content,
            });

            io.to(msgRoomId).emit('receiveMsg', newMsg);
            
            await newMsg.save();
            await MsgRoom.findByIdAndUpdate(msgRoomId, { $push: { messages: newMsg._id } });
            
            console.log(`Message sent to ${msgRoomId}: ${content}`);
        } catch (e) {
            console.log('Message send error:', e);
            socket.emit('errorMessage', { error: 'Failed to send message.' });
        }
    });

    // 채팅방 퇴장
    socket.on('disconnect', () => {
        console.log('WebSocket disconnected:', socket.id);
    });
});

async function connect() {
    try {
        await mongoose.connect(dburl);
        console.log('Successfully Connected DB');

        server.listen(PORT, () => {
            console.log(`서버 실행. Port : ${PORT}`);
        });
    } catch (e) {
        console.log('connect error : ', e);
    }
}

connect();