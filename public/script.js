const socket = io();

const messageInput = document.getElementById('messageInput');
const sendButton = document.getElementById('sendButton');
const messagesList = document.getElementById('messages');

// Format current time
function getCurrentTime() {
  return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

// Add message to UI
function addMessageToUI(message, type) {
  const li = document.createElement('li');
  li.className = `message ${type}`;

  const time = getCurrentTime();
  li.innerHTML = `<div class="message-text">${message}</div><small>${time}</small>`;
  
  messagesList.appendChild(li);
  messagesList.scrollTop = messagesList.scrollHeight;
}

// Send message
function sendMessage() {
  const message = messageInput.value.trim();
  if (message) {
    addMessageToUI(message, 'sent');
    socket.emit('chat message', message);
    messageInput.value = '';
  }
}

sendButton.addEventListener('click', sendMessage);
messageInput.addEventListener('keypress', (e) => {
  if (e.key === 'Enter') sendMessage();
});

// Receive message
socket.on('chat message', (msg) => {
  addMessageToUI(msg, 'received');
});

// Focus input on load
window.onload = () => messageInput.focus();