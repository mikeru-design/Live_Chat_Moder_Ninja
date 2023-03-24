import { initializeApp } from 'firebase/app';
import Chatroom from './js/chat';
import {
  getFirestore, collection, onSnapshot,
  query, where, orderBy
} from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDsX0I5_3l5scw6qXZ-rxA6RVrwCruHK4g",
  authDomain: "modern-ninja-live-chat.firebaseapp.com",
  projectId: "modern-ninja-live-chat",
  storageBucket: "modern-ninja-live-chat.appspot.com",
  messagingSenderId: "1002185451830",
  appId: "1:1002185451830:web:3fe26e211764666ab0ab97",
  measurementId: "G-9RM09PXBYD"
};

initializeApp(firebaseConfig);

const db = getFirestore();
export const chatsColRef = collection(db, 'chats');
const q = query(chatsColRef, where('room', '==', 'general'), orderBy('created_at', 'desc'))

onSnapshot(q, (snapshot) => {
  let chats = [];
    for (const doc of snapshot.docs) {
      chats.push({ ...doc.data(), id: doc.id })
    }
    console.log(snapshot.docs);
    console.log(chats);
})

const chatroom = new Chatroom('general', 'mikeru');

// chatroom.addChat('hello again')
//   .then(() => console.log('chat added'))
//   .catch(err => console.log(err));

