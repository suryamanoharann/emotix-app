// ============================================
// BASE URL (local Flask backend)
// ============================================
const API_BASE_URL = 'http://localhost:5000';


// ============================================
// USER AUTH
// ============================================
export const signupUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Signup failed');
  }

  return response.json();
};

export const loginUser = async (username, password) => {
  const response = await fetch(`${API_BASE_URL}/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password })
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(error.error || 'Login failed');
  }

  return response.json();
};


// ============================================
// ANALYZE & SAVE
// ============================================
export const analyzeAndSave = async (text, username, timestamp) => {
  const response = await fetch(`${API_BASE_URL}/analyze-and-save`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ text, username, timestamp })
  });

  if (!response.ok) throw new Error('Failed to analyze and save');

  return response.json();
};

export const getEntries = async (username) => {
  const response = await fetch(`${API_BASE_URL}/entries/${username}`);

  if (!response.ok) throw new Error('Failed to fetch entries');

  return response.json();
};

export const getMoodData = async (username) => {
  const response = await fetch(`${API_BASE_URL}/mood-data/${username}`);

  if (!response.ok) throw new Error('Failed to fetch mood data');

  return response.json();
};


// ============================================
// GEMINI SONG GENERATOR (UPDATED)
export const getGeminiSongs = async (emotion) => {

  // ⛔ DO NOT expose this in production — move to backend
  const apiKey = "AIzaSyAYrDENKAAWh3EK6ZFEwuqZttBSU3ZoS5E";

  const apiUrl =
    `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash-lite:generateContent?key=${apiKey}`;

  const prompt = `Return ONLY valid JSON with 2 Malayalam songs for emotion: ${emotion}

Format (no other text):
{
  "song1": "Song Title - Artist Name",
  "song2": "Song Title - Artist Name"
}

Songs must be REAL and POPULAR Malayalam songs.`;

  try {
    console.log('🎵 Gemini: Emotion =', emotion);

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 500,
          topP: 0.8,
          topK: 20
        }
      })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("❌ Gemini API Error:", errorText);
      throw new Error(`Gemini API failed with code ${response.status}`);
    }

    const data = await response.json();
    console.log("📦 Gemini raw:", data);
    console.log("📦 Full response:", JSON.stringify(data, null, 2));

    const generatedText =
      data.candidates?.[0]?.content?.parts?.[0]?.text;

    if (!generatedText) throw new Error("Empty Gemini response");

    const cleanText = generatedText
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    const jsonMatch = cleanText.match(/\{[\s\S]*\}/);

    if (!jsonMatch) throw new Error("No JSON found");

    const songs = JSON.parse(jsonMatch[0]);

    if (!songs.song1 || !songs.song2)
      throw new Error("Invalid song data format");

    console.log("🎶 Final songs:", songs);
    return songs;

  } catch (err) {
    console.error("❌ getGeminiSongs error:", err);
    throw err;
  }
};
    
