import { chatsColRef } from '..';
import { addDoc, query, where } from 'firebase/firestore';

export default class Chatroom {
  constructor(room, username){
    this.room = room;
    this.username = username;
    this.chats = chatsColRef;
  }

  async addChat(message) {
    const chat = {
      message,
      username: this.username,
      room: this.room,
      created_at: new Date(),
    };

    const response = await addDoc(chatsColRef, chat);
    return response;
  }
}

