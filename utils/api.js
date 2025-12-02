// Backend API configuration
const API_BASE_URL = "https://emogo-backend-cheryllyeung.onrender.com";

// Sync emotion data to backend
export const syncEmotionToBackend = async (emotionData) => {
  try {
    // Send sentiment data
    await fetch(`${API_BASE_URL}/sentiments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        user_id: "cheryllyeung",
        sentiment: emotionData.emotion.name,
        score: emotionData.intensity / 10,
        timestamp: emotionData.timestamp,
      }),
    });

    // Send GPS data if available
    if (emotionData.latitude && emotionData.longitude) {
      await fetch(`${API_BASE_URL}/gps`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "cheryllyeung",
          latitude: emotionData.latitude,
          longitude: emotionData.longitude,
          accuracy: null,
          timestamp: emotionData.timestamp,
        }),
      });
    }

    // Send vlog data if available
    if (emotionData.videoPath) {
      await fetch(`${API_BASE_URL}/vlogs`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          user_id: "cheryllyeung",
          video_url: emotionData.videoPath,
          description: `${emotionData.emotion.emoji} ${emotionData.emotion.name} - Intensity: ${emotionData.intensity}/10${emotionData.note ? ` - Note: ${emotionData.note}` : ""}`,
          timestamp: emotionData.timestamp,
        }),
      });
    }

    console.log("Data synced to backend successfully");
    return true;
  } catch (error) {
    console.error("Failed to sync to backend:", error);
    return false;
  }
};

// Fetch all data from backend
export const fetchFromBackend = async (type) => {
  try {
    const response = await fetch(`${API_BASE_URL}/${type}`);
    return await response.json();
  } catch (error) {
    console.error(`Failed to fetch ${type}:`, error);
    return [];
  }
};
