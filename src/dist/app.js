"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const mongoose_1 = __importDefault(require("mongoose"));
const socket_io_1 = require("socket.io");
const chat_1 = __importDefault(require("./Model/chat"));
dotenv_1.default.config();
const app = (0, express_1.default)();
const port = process.env.PORT || 5000;
const server = app.listen(port);
const io = new socket_io_1.Server(server, {
    cors: {
        origin: '*',
    },
});
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
mongoose_1.default.connect(`${process.env.MONGODB_URI}`)
    .then(() => {
    console.log('mongoDB connect!!');
    io.on('connection', (socket) => {
        socket.emit('test', { message: 'socket IO!' });
    });
})
    .catch((error) => console.log(error));
io.on('connection', (socket) => {
    socket.on('chatting', (data) => {
        const NewChat = new chat_1.default(data);
        NewChat.save().then(() => {
            io.emit('chatting', NewChat);
        });
    });
    socket.on('ChatData', (text) => {
        chat_1.default.find({})
            .exec()
            .then((datas) => {
            io.emit('ChatData', datas);
        });
    });
});
app.get('/chat', (req, res) => {
    chat_1.default.find({})
        .exec()
        .then((item) => {
        return res.status(200).json(item);
    })
        .catch((error) => {
        return res.status(500).json(error);
    });
});
app.use(express_1.default.json());
app.use((0, cors_1.default)({ origin: '*', credentials: true }));
app.use(express_1.default.static('public')); // public폴더 안에있는 모든 리소스를 가져갈 수 있음
app.get('/', (req, res) => {
    return res.status(200).json({ message: '서버연결!' });
});
