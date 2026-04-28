// --- EMLY GESTURE ACTIONS & COMBOS ---

const gestureHistory = {
  "Victory": 0,
  "Thumb_Up": 0,
  "Open_Palm": 0,
  "ILoveYou": 0,
  "Closed_Fist": 0,
  "Pointing_Up": 0
};

function executeSingleGesture(gesture, now) {
  console.log("✅ Gesture confirmed:", gesture);

  const face = document.querySelector('.face'); // Fixed selector
  const eyes = document.querySelectorAll('.eye');

  // --- TRIGGER UI & SPEECH FUNCTIONS ---

  if (gesture === "Victory") {
    // This is now handled as a toggle in vision.js, 
    // but we can add a verbal confirmation here.
    if (typeof emlySpeak === "function") emlySpeak("Grind mode initiated. Let's get to work!");
  } 
  
  else if (gesture === "Thumb_Up") {
    if (typeof enterHeroMode === "function") enterHeroMode(); 
    // She speaks inside enterHeroMode already!
    setTimeout(() => { if (typeof exitHeroMode === "function") exitHeroMode(); }, 5000);
  } 
  
  else if (gesture === "Open_Palm") {
    face.classList.add('tilt-confused');
    // EMLY SPEAKS: "Wait... what was that?"
    if (typeof emlySpeak === "function") emlySpeak("Wait... what was that?");
    
    setTimeout(() => {
      face.classList.remove('tilt-confused');
    }, 3000);
  } 
  
  else if (gesture === "ILoveYou") {
    eyes.forEach(eye => eye.classList.add('heartbeat'));
    // EMLY SPEAKS: "You're doing great!"
    if (typeof emlySpeak === "function") emlySpeak("You're doing great, bro! Keep it up.");
    
    setTimeout(() => {
      eyes.forEach(eye => eye.classList.remove('heartbeat'));
    }, 4000);
  }
  
  else if (gesture === "Pointing_Up") {
    eyes.forEach(eye => eye.classList.add('thinking'));
    // EMLY SPEAKS: "Hmm... let me think about that..."
    if (typeof emlySpeak === "function") emlySpeak("Hmm... let me think about that for a second.");
    
    setTimeout(() => {
      eyes.forEach(eye => eye.classList.remove('thinking'));
    }, 4000);
  }
  
  else if (gesture === "Closed_Fist") {
    eyes.forEach(eye => eye.classList.add('determination'));
    if (typeof emlySpeak === "function") emlySpeak("Locked in. No distractions.");
    
    setTimeout(() => {
      eyes.forEach(eye => eye.classList.remove('determination'));
    }, 4000);
  }
}
