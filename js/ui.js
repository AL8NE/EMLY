// --- EMLY UI & ANIMATIONS ---

// 1. Hero Mode (👍)
function enterHeroMode() {
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => eye.classList.add('power-up'));
  
  if (typeof emlySpeak === "function") {
    emlySpeak("Initiating Hero Mode. Let's crush these tasks!");
  }
  
  if (navigator.vibrate) navigator.vibrate(200);
}

function exitHeroMode() {
  const eyes = document.querySelectorAll('.eye');
  eyes.forEach(eye => {
    eye.classList.remove('power-up');
    eye.style.background = ""; 
    eye.style.boxShadow = "";
  });
  const bubble = document.getElementById('speech-bubble');
  bubble.style.color = "#000000"; 
  bubble.style.textShadow = "none";
  bubble.classList.add('hidden');
}

// 2. Idle & Wake States
function goIdle() {
  const clock = document.getElementById('digital-clock');
  const eyes = document.querySelectorAll('.eye');
  clock.classList.remove('hidden');
  
  eyes.forEach(eye => {
    eye.style.opacity = "0.5"; 
    eye.classList.remove('thinking');
    eye.classList.add('sleeping');
  });
}

function wakeUp() {
  const clock = document.getElementById('digital-clock');
  const eyes = document.querySelectorAll('.eye');
  clearTimeout(window.idleTimer);
  
  clock.classList.add('hidden');
  
  eyes.forEach(eye => {
    eye.style.opacity = "1";
    eye.classList.remove('sleeping');
    eye.style.transform = `translate(var(--x, 0px), var(--y, 0px))`;
  });
  
  window.idleTimer = setTimeout(goIdle, 600000); // 10 Minutes
}

// 3. Eye Mechanics
function startBlinking() {
  const eyes = document.querySelectorAll('.eye');
  setTimeout(() => {
    eyes.forEach(eye => eye.classList.add('blinking'));
    setTimeout(() => {
      eyes.forEach(eye => eye.classList.remove('blinking'));
      startBlinking();
    }, 200);
  }, Math.random() * 4000 + 3000);
}

// 4. Panel & View Toggles
function toggleTasks() {
  const panel = document.getElementById('task-panel');
  const eyes = document.querySelectorAll('.eye');
  if (!panel) return;

  panel.classList.toggle('open');
  
  if (panel.classList.contains('open')) {
    eyes.forEach(eye => {
      eye.style.setProperty('--x', '40px');
      eye.style.setProperty('--y', '0px');
      eye.style.transform = `translate(var(--x), var(--y))`;
    });
    if (typeof emlySpeak === "function") emlySpeak("Grind Mode: Let's get to work on XLR8!");
  } else {
    wakeUp(); 
  }
}

function toggleCameraView() {
  const camWindow = document.getElementById('camera-window');
  camWindow.classList.toggle('hidden');
}

// 5. Night Vision (Flashlight)
function toggleNightLight() {
    document.body.classList.toggle('flashlight-mode');
    const btn = document.getElementById('light-toggle');
    if (document.body.classList.contains('flashlight-mode')) {
        btn.innerText = "🕶️";
        if (typeof emlySpeak === "function") emlySpeak("Night Vision Active!");
    } else {
        btn.innerText = "💡";
        wakeUp();
    }
}

// 6. Secret Command Hub
function openFloatingWindow() {
  const win = document.getElementById('floating-window');
  const eyes = document.querySelectorAll('.eye');
  win.classList.remove('hidden');
  
  eyes.forEach(eye => {
    eye.style.setProperty('--x', '0px');
    eye.style.setProperty('--y', '-40px'); 
    eye.style.transform = `translate(var(--x), var(--y))`;
  });
  
  if (typeof emlySpeak === "function") emlySpeak("Property Hub Online.");
}

function closeWindow() {
  document.getElementById('floating-window').classList.add('hidden');
  wakeUp();
}

// 7. Initialize Blinking
startBlinking();
