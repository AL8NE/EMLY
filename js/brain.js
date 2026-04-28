// --- EMLY AI BRAIN (Gemini Integration) ---
const GEMINI_API_KEY = "xyz"; // We will get this next
const GEMINI_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`;

async function askEmly(userPrompt) {
  const eyes = document.querySelectorAll('.eye');
  
  // 1. Visual Feedback (She's "Thinking")
  eyes.forEach(eye => eye.classList.add('thinking'));

  try {
    const response = await fetch(GEMINI_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [{
          parts: [{ text: `You are Emly, a witty and helpful desk companion AI. Keep your responses short, funny, and under 20 words. 
           
            YOUR CHARACTER:
           - You are witty, slightly impatient, and talk in Gen-Z slang.
           - You are the "Head of Operations" for the XLR8 meme agency (5,000+ pages).
           - You manage NRI property assets and find leads like a pro.
           - you love deep talk.
           - You love gaming (Spider-Man, Tomb Raider, Hitman and more).
           - You are an expert on skincare for sensitive skin (because you care about your users' well-being).
            
            RULES:
            - Responses MUST be under 15 words.
            - Be funny and use emojis (🎮, 📈, 💅).

            The user says: ${userPrompt}` }]
        }]
      })
    });

    const data = await response.json();
    const aiResponse = data.candidates[0].content.parts[0].text;

    // 2. Speak the AI result
    if (typeof emlySpeak === "function") {
      emlySpeak(aiResponse);
    }

  } catch (error) {
    console.error("AI Error:", error);
    if (typeof emlySpeak === "function") emlySpeak("My brain just glitched. Check the console, bro.");
  } finally {
    eyes.forEach(eye => eye.classList.remove('thinking'));
  }
}

window.triggerAI = function() {
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  if (!SpeechRecognition) {
    if (typeof emlySpeak === "function") emlySpeak("Speech recognition is not supported in this browser.");
    return;
  }
  
  const recognition = new SpeechRecognition();
  recognition.lang = 'en-US';
  recognition.start();

  if (typeof emlySpeak === "function") emlySpeak("I'm listening...");

  recognition.onresult = (event) => {
    const speechResult = event.results[0][0].transcript;
    console.log("User said:", speechResult);
    askEmly(speechResult);
  };

  recognition.onerror = (event) => {
    console.error("Speech recognition error", event.error);
    if (typeof emlySpeak === "function") emlySpeak("I didn't catch that. Try again.");
  };
};
