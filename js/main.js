// --- EMLY CORE ENGINE & SENSORS ---

// 1. Selectors & Assets
const eyes = document.querySelectorAll('.eye');
const bubble = document.getElementById('speech-bubble');
const face = document.querySelector('.face');
const clock = document.getElementById('digital-clock');

let touchTimer;
let idleTimer;

// 2. Mouse & Touch Tracking
const handleMove = (e) => {
  const xPos = e.touches ? e.touches[0].pageX : e.pageX;
  const yPos = e.touches ? e.touches[0].pageY : e.pageY;

  eyes.forEach(eye => {
    const rect = eye.getBoundingClientRect();
    const eyeX = rect.left + rect.width / 2;
    const eyeY = rect.top + rect.height / 2;
    const angle = Math.atan2(yPos - eyeY, xPos - eyeX);
    const distance = 15;

    const moveX = Math.cos(angle) * distance;
    const moveY = Math.sin(angle) * distance;

    eye.style.setProperty('--x', `${moveX}px`);
    eye.style.setProperty('--y', `${moveY}px`);
    eye.style.transform = `translate(var(--x), var(--y))`;
  });
};

// 3. Physical Sensors (Motion & Battery)
function initMotion() {
  window.addEventListener('devicemotion', (event) => {
    const acc = event.accelerationIncludingGravity;
    if (!acc) return;
    const movement = Math.abs(acc.x) + Math.abs(acc.y) + acc.z; 
    
    if (movement > 15) {
      eyes.forEach(eye => eye.classList.add('dizzy'));
      
      // Fixed: Proper Voice Sync
      if (typeof emlySpeak === "function") {
        emlySpeak("Woah! Everything is spinning!"); 
      }

      clearTimeout(window.dizzyTimeout);
      window.dizzyTimeout = setTimeout(() => {
        eyes.forEach(eye => eye.classList.remove('dizzy'));
        bubble.classList.add('hidden');
      }, 2000);
    }
  });
}

async function monitorBattery() {
  if ('getBattery' in navigator) {
    const battery = await navigator.getBattery();
    const update = () => {
      const isLow = (battery.level * 100) < 20 && !battery.charging;
      
      eyes.forEach(eye => {
        eye.classList.toggle('low-battery', isLow);
        eye.classList.toggle('charging', battery.charging);
      });

      if (isLow) { 
        if (typeof emlySpeak === "function") emlySpeak("I'm sleepy... I need some power soon.");
      }
    };

    battery.addEventListener('levelchange', update);
    battery.addEventListener('chargingchange', update);
    update();
  }
} // Fixed: Added missing closing bracket for the function

// 4. Utility Cycles (Clock, Sky, WakeLock)
function updateClock() {
    const now = new Date();
    if (clock) {
      clock.innerText = `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`;
    }
}

function updateSky() {
  const hour = new Date().getHours();
  const sky = document.getElementById('sky-element');
  const stars = document.getElementById('stars');
  if (!sky || !stars) return;

  if (hour >= 6 && hour < 19) {
    sky.innerText = hour < 16 ? "☀️" : "🌅";
    stars.style.display = "none";
  } else {
    sky.innerText = "🌙";
    sky.style.top = "8%";
    sky.style.left = "20%";
    stars.style.display = "block"; 
  }
}

async function keepEmlyAwake() {
  try {
    if ('wakeLock' in navigator) {
        const wakeLock = await navigator.wakeLock.request('screen');
        console.log("Emly is wide awake!");
    }
  } catch (err) { console.log("WakeLock failed."); }
}

// 5. Event Listeners & Boot Up
document.addEventListener('mousemove', (e) => { handleMove(e); wakeUp(); });
document.addEventListener('touchstart', () => { wakeUp(); });
document.addEventListener('touchmove', handleMove);

face.addEventListener('touchstart', (e) => {
  e.stopPropagation(); // Don't let the document wakeUp() block it
  eyes.forEach(eye => eye.classList.add('laughing'));
  if (typeof emlySpeak === "function") emlySpeak("Haha, that tickles!");
  setTimeout(() => eyes.forEach(eye => eye.classList.remove('laughing')), 2000);
});

face.addEventListener('click', () => {
  eyes.forEach(eye => eye.classList.add('laughing'));
  if (typeof emlySpeak === "function") emlySpeak("Haha, that tickles!");
  setTimeout(() => eyes.forEach(eye => eye.classList.remove('laughing')), 2000);
});

document.addEventListener('click', () => {
  keepEmlyAwake();
  if (typeof DeviceMotionEvent !== 'undefined' && typeof DeviceMotionEvent.requestPermission === 'function') {
    DeviceMotionEvent.requestPermission().then(res => { if(res === 'granted') initMotion(); });
  } else { initMotion(); }
}, { once: true });

// Start everything
monitorBattery();
updateSky();
setInterval(updateClock, 1000);
setInterval(updateSky, 600000);
updateClock();
wakeUp();

// --- AUTONOMOUS EMOTION ENGINE ---
function autonomousBehavior() {
  const hour = new Date().getHours();
  const roll = Math.random();

  // 1. Late Night Behavior (Grumpy)
  if (hour >= 0 && hour < 6) {
    if (roll > 0.8) {
      eyes.forEach(eye => eye.classList.add('sleepy-squint'));
      if (typeof emlySpeak === "function") {
        emlySpeak("Why are we still awake? It's literally the middle of the night.");
      }
      setTimeout(() => {
        eyes.forEach(eye => eye.classList.remove('sleepy-squint'));
      }, 4000);
      return; 
    }
  }

  // 2. Idle Behaviors
  const isIdle = !clock.classList.contains('hidden');
  if (isIdle) {
    if (roll > 0.9) {
      eyes.forEach(eye => eye.style.transform = `translate(-30px, 0px)`);
      setTimeout(() => eyes.forEach(eye => eye.style.transform = `translate(0px, 0px)`), 2000);
    } else if (roll > 0.8) {
      eyes.forEach(eye => eye.style.transform = `translate(30px, 0px)`);
      setTimeout(() => eyes.forEach(eye => eye.style.transform = `translate(0px, 0px)`), 2000);
    } else if (roll > 0.7) {
      eyes.forEach(eye => eye.classList.add('thinking'));
      setTimeout(() => eyes.forEach(eye => eye.classList.remove('thinking')), 2000);
    }
  }
}

setInterval(autonomousBehavior, 10000);

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(() => console.log("Emly App Ready for Install!"))
    .catch((err) => console.log("Service Worker Failed", err));
}