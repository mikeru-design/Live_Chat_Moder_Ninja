import { initializeApp } from 'firebase/app';
// import Chatroom from './js/chat';
import { getFirestore, collection, onSnapshot, addDoc, query, where, orderBy } from 'firebase/firestore';
import { formatDistanceToNow } from 'date-fns';

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

const chatList = document.querySelector('.chat-list');
const addMessage = document.querySelector('.messageInput');
const nameInput = document.querySelector('.nameInput');
const roomSelection = document.querySelector('.roomSelection');
const updateUserMsg = document.querySelector('.update-msg');
const roomSelBtn = document.querySelectorAll('.roomSelBtn');

const db = getFirestore();
const chatsCollRef = collection(db, 'chats');

let room = '';
let username = localStorage.username ? localStorage.username : 'Guest';

const addClassToRoomBtn = (e) => {
  for ( const selBtn of roomSelBtn ) {
    selBtn.classList.remove('activeRoom');}

  e.target.classList.add('activeRoom');
};
const addMsg = () => {

  const message = {
    message: addMessage.message.value,
    username: username,
    room: room,
    created_at: new Date(),
  };

  if ( message.message && message.room ) {
    addDoc(chatsCollRef, message)
      .then(() => {
        // console.log('chat added');
        addMessage.reset();
      })
      .catch(err => console.log(err));
  }
  else if ( !room ) {
    updateUserMsg.innerHTML = `<p>Please <span class="newUsername">choose a room</span> you want to chat at...</span>`;
    setTimeout(() => { updateUserMsg.innerHTML = ''; }, 5000);
  }
};
const updUsername = (username) => {
  updateUserMsg.innerHTML = `<p>Your current username is <span class="newUsername">${username}</span></p>`;
  setTimeout(() => { updateUserMsg.innerHTML = ''; }, 5000);
};

setTimeout( () => {updUsername(username);}, 3000);

roomSelection.addEventListener('click', e => {
  if ( e.target.className.includes("btn") ) {

    if ( room !== e.target.getAttribute('id') ) {

      addClassToRoomBtn(e);
      room = e.target.getAttribute('id');
      const q = query(chatsCollRef, where('room', '==', room), orderBy('created_at', 'desc'));

      onSnapshot(q, (snapshot) => {
        let messagesData = [];
        let HTML = ``;

        if( room ){
          for (const doc of snapshot.docs) {
            messagesData.push({
              message: doc.data().message,
              username: doc.data().username,
              created_at:
                formatDistanceToNow(
                  doc.data().created_at.toDate(),
                  { addSuffix: true }),
              id: doc.id});
          }

          messagesData.forEach( messageData => {
            HTML += `
              <li class="message">
                <span class="username">${messageData.username}</span>
                <span class="message-text">${messageData.message}</span>
                <p class="time">${messageData.created_at}</p>
              </li>
            `;
          });

          chatList.innerHTML = HTML;
        }
      });
    }
  }
});

addMessage.addEventListener('submit', e => {
  e.preventDefault();

  addMsg();
});

nameInput.addEventListener('submit', e => {
  e.preventDefault();

  if ( nameInput.name.value ) {
    username = nameInput.name.value;

    updUsername(username);

    localStorage.setItem('username', username);
    nameInput.reset();
  }
});