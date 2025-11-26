import * as SQLite from "expo-sqlite";

let db = null;

export const initDatabase = async () => {
  try {
    db = await SQLite.openDatabaseAsync("emogo.db");

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS emotions (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        emotion_name TEXT NOT NULL,
        emotion_emoji TEXT NOT NULL,
        emotion_color TEXT NOT NULL,
        intensity INTEGER NOT NULL,
        note TEXT,
        latitude REAL,
        longitude REAL,
        video_path TEXT,
        timestamp TEXT NOT NULL
      );
    `);

    console.log("Database initialized successfully");
    return db;
  } catch (error) {
    console.error("Failed to initialize database:", error);
    throw error;
  }
};

export const getDatabase = () => {
  if (!db) {
    throw new Error("Database not initialized. Call initDatabase first.");
  }
  return db;
};

export const saveEmotion = async (emotionData) => {
  const database = getDatabase();

  const result = await database.runAsync(
    `INSERT INTO emotions (emotion_name, emotion_emoji, emotion_color, intensity, note, latitude, longitude, video_path, timestamp)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [
      emotionData.emotion.name,
      emotionData.emotion.emoji,
      emotionData.emotion.color,
      emotionData.intensity,
      emotionData.note || null,
      emotionData.latitude || null,
      emotionData.longitude || null,
      emotionData.videoPath || null,
      emotionData.timestamp,
    ]
  );

  return result.lastInsertRowId;
};

export const getAllEmotions = async () => {
  const database = getDatabase();

  const result = await database.getAllAsync(
    `SELECT * FROM emotions ORDER BY timestamp DESC`
  );

  return result.map((row) => ({
    id: row.id,
    emotion: {
      name: row.emotion_name,
      emoji: row.emotion_emoji,
      color: row.emotion_color,
    },
    intensity: row.intensity,
    note: row.note,
    latitude: row.latitude,
    longitude: row.longitude,
    videoPath: row.video_path,
    timestamp: row.timestamp,
  }));
};

export const clearAllEmotions = async () => {
  const database = getDatabase();
  await database.runAsync(`DELETE FROM emotions`);
};

export const getEmotionsCount = async () => {
  const database = getDatabase();
  const result = await database.getFirstAsync(`SELECT COUNT(*) as count FROM emotions`);
  return result.count;
};
