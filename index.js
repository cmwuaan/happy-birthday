import { initializeApp } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-app.js';
import { getDatabase, ref, set, onValue } from 'https://www.gstatic.com/firebasejs/10.7.2/firebase-database.js';

const firebaseConfig = {
  apiKey: 'AIzaSyDyAzj9ieM1D2QDLPhcve3-swej4Z3i96A',
  authDomain: 'mom-birthday-240ee.firebaseapp.com',
  projectId: 'mom-birthday-240ee',
  storageBucket: 'mom-birthday-240ee.appspot.com',
  messagingSenderId: '1010184848995',
  appId: '1:1010184848995:web:e8d1540ad50b71ab871a56',
  databaseURL: 'https://mom-birthday-240ee-default-rtdb.firebaseio.com',
};

var mainBtn = document.getElementById('main-btn');
var heading = document.getElementById('value-test');
var cake = document.getElementById('cake');
var flame = document.getElementById('flame-wrapper');
var popup = document.getElementById('overlay');
var isActive = true;

const app = initializeApp(firebaseConfig);
const database = getDatabase(app);
var randomNumber = 0;

const dataRef = ref(database, 'data');

console.log(app);
console.log(database);

function updateUI(data) {
  heading.innerHTML = data['sample'];
}

function sendData() {
  // randomNumber = Math.floor(Math.random() * 10) + 1;
  // console.log(randomNumber);
  const userData = {
    sample: 1,
  };
  set(dataRef, userData)
    .then(() => {
      console.log('Data sucessfully updated!');
    })
    .catch((error) => {
      console.error('Error updating data: ', error);
    });
}

function fetchData() {
  onValue(dataRef, (snapshot) => {
    const data = snapshot.val();
    updateUI(data);
    console.log('Fetched data:', data);
  });
}

function setupAudio() {
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
    navigator.mediaDevices
      .getUserMedia({
        audio: true,
      })
      .then((stream) => {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const analyser = audioContext.createAnalyser();
        const microphone = audioContext.createMediaStreamSource(stream);

        // Connect the microphone to the analyser
        microphone.connect(analyser);

        // Set up the analyser
        analyser.fftSize = 256;
        const dataArray = new Uint8Array(analyser.fftSize);

        // Function to analyze the audio input
        function analyzeAudio() {
          analyser.getByteFrequencyData(dataArray);

          // Calculate the average volume
          const volume = dataArray.reduce((sum, value) => sum + value, 0) / dataArray.length;

          // You can adjust the threshold based on your preference
          const threshold = 50;
          const maxThreshold = 80;

          // Trigger the fire effect if the volume exceeds the threshold

          if (isActive) {
            console.log(volume);
            if (volume >= maxThreshold) {
              flame.classList.remove('active');
              flame.classList.remove('active-other');
              isActive = false;
              // startConfetti();
              sendData();
            } else if (volume >= threshold) {
              flame.classList.add('active-other');
              flame.classList.remove('active');
            } else {
              flame.classList.add('active');
              flame.classList.remove('active-other');
            }
          }
          console.log(volume);

          // Call the function recursively
          requestAnimationFrame(analyzeAudio);
        }

        // Start analyzing the audio input
        analyzeAudio();
      })
      .catch((err) => {
        console.error(err);
      });
  }
}

cake.addEventListener('click', () => {
  var flame = document.getElementById('flame-wrapper');
  flame.classList.toggle('active');
  isActive = !isActive;
  popup.style.display = 'none';
});
// fetchData();
setupAudio();

function createConfetti() {
  const confetti = document.createElement('div');
  confetti.className = 'confetti';
  confetti.style.left = Math.random() * window.innerWidth + 'px';
  document.body.appendChild(confetti);

  confetti.addEventListener('animationiteration', () => {
    confetti.style.left = Math.random() * window.innerWidth + 'px';
  });

  setTimeout(() => {
    confetti.remove();
  }, 5000);
}

function startConfetti() {
  setInterval(createConfetti, 300);
}
