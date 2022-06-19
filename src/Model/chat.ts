import mongoose from 'mongoose';

const { Schema } = mongoose;

const chatSchema = new Schema({
  chatText: String,
  date: String,
});

const Chat = mongoose.model('Chat', chatSchema);

export default Chat;
