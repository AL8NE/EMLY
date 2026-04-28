// --- EMLY AI VISION ENGINE ---

let handLandmarker;
let lastVideoTime = -1;
let pendingGesture = null;
let comboWaitTimer = null;
let lastDetected = null;
let gestureCooldowns = {};

const initAI = async () => {
  const video = document.getElementById('webcam');
  if (!video) return;

  try {
    console.log("Waking up Emly's Vision...");
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;

    const FilesetResolver = window.FilesetResolver;
    const GestureRecognizer = window.GestureRecognizer;

    const vision = await FilesetResolver.forVisionTasks(
      "https://cdn.jsdelivr.net/npm/@mediapipe/tasks-vision@0.10.0/wasm"
    );
    
    handLandmarker = await GestureRecognizer.createFromOptions(vision, {
      baseOptions: {
        modelAssetPath: "https://storage.googleapis.com/mediapipe-models/gesture_recognizer/gesture_recognizer/float16/1/gesture_recognizer.task",
        delegate: "GPU"
      },
      runningMode: "VIDEO",
      numHands: 1 
    });
    
    console.log("Emly is officially watching!");
    predictWebcam(); 
  } catch (err) { 
    console.error("Camera/Vision Error:", err); 
  }
};

document.addEventListener('click', initAI, { once: true });

async function predictWebcam() {
  const video = document.getElementById('webcam'); 
  
  if (handLandmarker && video && video.currentTime !== lastVideoTime) {
    lastVideoTime = video.currentTime;
    const results = handLandmarker.recognizeForVideo(video, performance.now());
    
    if (results.gestures.length > 0) {
      const currentGesture = results.gestures[0][0].categoryName;
      const now = Date.now();
      
      // ONLY run logic if the gesture actually changed
      if (currentGesture !== lastDetected) {
        lastDetected = currentGesture;

        // 1. 5-Second Cooldown Check
        if (gestureCooldowns[currentGesture] && (now - gestureCooldowns[currentGesture] < 5000)) {
          return; 
        }

        // 2. COMBO HIT: If we were waiting for Palm and got Victory
        if (pendingGesture === "Open_Palm" && currentGesture === "Victory") {
          console.log("🔥 COMBO HIT: Palm + Victory!");
          clearTimeout(comboWaitTimer);
          pendingGesture = null; 
          
          gestureCooldowns["Victory"] = now; // Lock Victory
          if (typeof openFloatingWindow === "function") openFloatingWindow(); 
          return; // STOP HERE so the single Victory toggle doesn't fire
        }

        // 3. COMBO STARTER: If we see a Palm
        if (currentGesture === "Open_Palm") {
          pendingGesture = "Open_Palm";
          console.log("⏳ Palm detected. Waiting 2s for combo...");
          
          clearTimeout(comboWaitTimer);
          comboWaitTimer = setTimeout(() => {
            // If 2s pass and no Victory happened, fire the standalone Palm
            if (pendingGesture === "Open_Palm") {
              console.log("✋ 2s passed. Firing single Palm action.");
              gestureCooldowns["Open_Palm"] = Date.now();
              if (typeof executeSingleGesture === "function") executeSingleGesture("Open_Palm", Date.now());
              pendingGesture = null;
            }
          }, 2000); 
        }
        
        // 4. STANDALONE VICTORY: Toggles Grind Mode
        else if (currentGesture === "Victory") {
          console.log("✌️ Single Victory: Toggling Tasks");
          gestureCooldowns["Victory"] = now;
          if (typeof toggleTasks === "function") toggleTasks();
        }

        // 5. ANY OTHER GESTURES
        else {
          if (pendingGesture === "Open_Palm") {
             clearTimeout(comboWaitTimer);
             pendingGesture = null;
          }
          gestureCooldowns[currentGesture] = now;
          if (typeof executeSingleGesture === "function") executeSingleGesture(currentGesture, now);
        }
      }
    }
  }
  window.requestAnimationFrame(predictWebcam);
}
