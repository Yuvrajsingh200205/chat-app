let socket;
let username;

document.getElementById('join-form').addEventListener('submit', (e) => {
  e.preventDefault();
  username = document.getElementById('username').value;
  socket = new WebSocket('ws://localhost:8080');
  
  socket.onopen = () => {
    socket.send(`join ${username}`);
    document.getElementById('join-form').style.display = 'none';
    document.getElementById('message-form').style.display = 'block';
    document.getElementById('chat-log').innerHTML += `<p>You have joined the chat!</p>`;
  };
});

document.getElementById('message-form').addEventListener('submit', (e) => {
  e.preventDefault();
  let message = document.getElementById('message').value;
  socket.send(message);
  document.getElementById('chat-log').innerHTML += `<p>${username}: ${message}</p>`;
  document.getElementById('message').value = '';
});

socket.onmessage = (event) => {
  const message = event.data;
  document.getElementById('chat-log').innerHTML += `<p>${message}</p>`;
  document.getElementById('chat-log').scrollTop = document.getElementById('chat-log').scrollHeight;
};

socket.onclose = () => {
  document.getElementById('chat-log').innerHTML += `<p>Disconnected from the chat room.</p>`;
};
