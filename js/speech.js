// --- EMLY SPEECH ENGINE (Text-to-Speech) ---

let availableVoices = [];

// Initialize voices
const loadVoices = () => {
  availableVoices = window.speechSynthesis.getVoices();
};

if (window.speechSynthesis.onvoiceschanged !== undefined) {
  window.speechSynthesis.onvoiceschanged = loadVoices;
}

function emlySpeak(text) {
  const bubble = document.getElementById('speech-bubble');
  const eyes = document.querySelectorAll('.eye');
  
  // 1. Interrupt any current speech (Snappy Response)
  window.speechSynthesis.cancel(); 

  // 2. Update the UI
  if (bubble) {
    bubble.innerText = text;
    bubble.classList.remove('hidden');
  }
  
  // Make her eyes bounce while she talks
  eyes.forEach(eye => eye.classList.add('thinking'));

  // 3. Prepare the Audio
  const utterance = new SpeechSynthesisUtterance(text);
  
  // Voice Selection logic
  if (availableVoices.length > 0) {
    // Priority: UK Female -> US Female -> Any Female -> First available
    const preferredVoice = availableVoices.find(v => v.name.includes('Google UK English Female')) || 
                           availableVoices.find(v => v.name.includes('Female')) ||
                           availableVoices[0];
    if (preferredVoice) utterance.voice = preferredVoice;
  }
  
  utterance.pitch = 1.2; // Friendly AI vibe
  utterance.rate = 1.0;  // Natural speed
  
  // 4. Cleanup when finished
  utterance.onend = () => {
    eyes.forEach(eye => eye.classList.remove('thinking'));
    // Delay hiding the bubble so you can finish reading
    setTimeout(() => {
      if (!window.speechSynthesis.speaking) {
        bubble.classList.add('hidden');
      }
    }, 3000); 
  };

  // 5. Execution
  window.speechSynthesis.speak(utterance);
}
