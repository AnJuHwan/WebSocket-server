import express, { Request, Response } from 'express';

import cors from 'cors';
import dotenv from 'dotenv';
import Mongoose from 'mongoose';
import { Server } from 'socket.io';
import Chat from './Model/chat';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;
const server = app.listen(port);
const io = new Server(server, {
  cors: {
    origin: '*',
  },
});

app.use(cors({ origin: '*', credentials: true }));

Mongoose.connect(`${process.env.MONGODB_URI}`)
  .then(() => {
    console.log('mongoDB connect!!');
    io.on('connection', (socket) => {
      socket.emit('test', { message: 'socket IO!' });
    });
  })
  .catch((error) => console.log(error));

io.on('connection', (socket) => {
  socket.on('chatting', (data) => {
    const NewChat = new Chat(data);
    NewChat.save().then(() => {
      io.emit('chatting', NewChat);
    });
  });

  socket.on('ChatData', (text) => {
    Chat.find({})
      .exec()
      .then((datas) => {
        io.emit('ChatData', datas);
      });
  });
});

app.get('/chat', (req, res) => {
  Chat.find({})
    .exec()
    .then((item) => {
      return res.status(200).json(item);
    })
    .catch((error) => {
      return res.status(500).json(error);
    });
});

app.use(express.json());
app.use(cors({ origin: '*', credentials: true }));

app.use(express.static('public')); // public폴더 안에있는 모든 리소스를 가져갈 수 있음

app.get('/', (req, res) => {
  return res.status(200).json({ message: '서버연결!' });
});
