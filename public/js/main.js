const chatForm = document.querySelector('#chat-form');
const chatMessages = document.querySelector('.chat-messages');
const roomName = document.querySelector('#room-name');
const userList = document.querySelector('#users');

// Get username and room from URL
const { username, room } = Qs.parse(location.search, {
  ignoreQueryPrefix: true,
});

const socket = io();

// Join chat room
socket.emit('joinRoom', { username, room });

// Get room and users
socket.on('roomUsers', ({ room, users }) => {
  outputRoomName(room);
  outputUsers(users);
});

// Msg from server
socket.on('msg', msg => {
  outoutMsg(msg);

  // Scroll Down
  chatMessages.scrollTop = chatMessages.scrollHeight;
});

// Message submit
chatForm.addEventListener('submit', e => {
  e.preventDefault();

  // get msg text
  const msg = e.target.elements.msg.value;

  // Emit msg to server
  socket.emit('chatMsg', msg);

  // Clear input
  e.target.elements.msg.value = '';
  e.target.elements.msg.focus();
});

// Output Msg to DOM
function outoutMsg(msg) {
  const div = document.createElement('div');
  div.classList.add('message');
  div.innerHTML = `
    <p class="meta">${msg.username} <span>${msg.time}</span></p>
    <p>
    ${msg.text}
    </p>`;
  document.querySelector('.chat-messages').appendChild(div);
}

// Add Room name to DOM
function outputRoomName(room) {
  roomName.innerText = room;
}

// Add users to DOM
function outputUsers(users) {
  userList.innerHTML = `
  ${users
    .map(
      user => `
  <li>${user.username}</li>
  `
    )
    .join('')}
  `;
}
