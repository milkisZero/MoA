require('dotenv').config();

const { swaggerUi, specs } = require('./swagger.js');
const MongoStore = require('connect-mongo');
const mongoose = require('mongoose');
const session = require('express-session');
const express = require('express');
const cors = require('cors');

const app = express();
const PORT = 8080;
const dburl =
    '[DB_URL] origin: true, credentials: true }));
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

const { User } = require('./model/User');

app.get('/api/session/', async (req, res) => {
    if (!req.session || !req.session.userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized' });
    }
    const user = await User.findById(req.session.userId);
    return res.status(200).json({
        message: 'Successfully user found',
        user,
    });
});

const userRoutes = require('./router/user');
const clubRoutes = require('./router/club');
const postRoutes = require('./router/post');
const eventRoutes = require('./router/event');
const msgRoomRoutes = require('./router/msgRoom');
const messageRoutes = require('./router/message');
const verifyMailRoutes = require('./router/verifyMail');

app.use('/api/user', userRoutes);
app.use('/api/club', clubRoutes);
app.use('/api/post', postRoutes);
app.use('/api/event', eventRoutes);
app.use('/api/msgRoom', msgRoomRoutes);
app.use('/api/msg', messageRoutes);
app.use('/api/verifyMail', verifyMailRoutes);

async function connect() {
    try {
        await mongoose.connect(dburl);
        console.log('Successfully Connected DB');

        app.listen(PORT, () => {
            console.log(`서버 실행. Port : ${PORT}`);
        });
    } catch (e) {
        console.log('connect error : ', e);
    }
};

connect();
