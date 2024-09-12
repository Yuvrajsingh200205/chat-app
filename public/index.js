// document.addEventListener('DOMContentLoaded', function() {
//     document.getElementById('theme-toggle').addEventListener('click', function() {
//       document.body.classList.toggle('dark-mode');
//     });
//   });
  
//   <video id="video" width="640" height="480" autoplay></video>
//   function cameraOff() {

//     var video = document.getElementById('video');
//     if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//         navigator.mediaDevices.getUserMedia({
//             video: true
//         }).then(function(stream) {
//             video.srcObject = stream;
//             video.play();
//         });
//     }
// }


//dark mode toggle 
// document.addEventListener('DOMContentLoaded', function() {
//     document.querySelector('[data-theme-toggle]').addEventListener('click', function() {
//         document.body.classList.toggle('dark-mode');
//         const isDarkMode = document.body.classList.contains('dark-mode');
//         this.setAttribute('aria-label', `Change to ${isDarkMode ? 'light' : 'dark'} theme`);
//     });
// });


document.addEventListener('DOMContentLoaded', function() {
    const themeSwitch = document.getElementById('theme-switch');
  
    // Check if dark mode is already enabled (from previous session, for example)
    if (localStorage.getItem('darkMode') === 'enabled') {
      document.body.classList.add('dark-mode');
      themeSwitch.checked = true;
    }
  
    themeSwitch.addEventListener('change', function() {
      if (this.checked) {
        document.body.classList.add('dark-mode');
        localStorage.setItem('darkMode', 'enabled'); // Store the preference
      } else {
        document.body.classList.remove('dark-mode');
        localStorage.setItem('darkMode', 'disabled');
      }
    });
  });
  

// Video Recording Logic
let videoElement = document.createElement('video');
const recordButton = document.getElementById('button');
let mediaRecorder;
let recordedChunks = [];

async function cameraOff() {
    if (!mediaRecorder || mediaRecorder.state === 'inactive') {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoElement.srcObject = stream;
        videoElement.play();
        document.body.appendChild(videoElement);

        mediaRecorder = new MediaRecorder(stream);
        mediaRecorder.ondataavailable = function(event) {
            if (event.data.size > 0) {
                recordedChunks.push(event.data);
            }
        };

        mediaRecorder.onstop = function() {
            const blob = new Blob(recordedChunks, { type: 'video/webm' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'video.webm';
            document.body.appendChild(a);
            a.click();
            recordedChunks = [];
        };

        mediaRecorder.start();
        recordButton.textContent = 'Stop Recording';
    } else {
        mediaRecorder.stop();
        videoElement.srcObject.getTracks().forEach(track => track.stop());
        document.body.removeChild(videoElement);
        recordButton.textContent = 'Start Recording';
    }
}




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
