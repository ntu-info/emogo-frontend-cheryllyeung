import { View, Text, StyleSheet, TouchableOpacity, TextInput, ScrollView, Alert } from "react-native";
import { useState, useEffect } from "react";
import { initDatabase, saveEmotion } from "../../utils/database";
import { requestNotificationPermissions, scheduleNotifications } from "../../utils/notifications";
import { getCurrentLocation } from "../../utils/location";
import { syncEmotionToBackend } from "../../utils/api";
import VlogRecorder from "../../components/VlogRecorder";

const EMOTIONS = [
  { emoji: "😊", name: "Happy", color: "#FFD93D" },
  { emoji: "😢", name: "Sad", color: "#6BCB77" },
  { emoji: "😠", name: "Angry", color: "#FF6B6B" },
  { emoji: "😰", name: "Anxious", color: "#A8E6CF" },
  { emoji: "😌", name: "Calm", color: "#95E1D3" },
  { emoji: "😴", name: "Tired", color: "#B4A5E8" },
  { emoji: "🤔", name: "Thoughtful", color: "#F9A826" },
  { emoji: "😎", name: "Cool", color: "#4ECDC4" },
];

export default function HomeScreen() {
  const [selectedEmotion, setSelectedEmotion] = useState(null);
  const [intensity, setIntensity] = useState(5);
  const [note, setNote] = useState("");
  const [videoPath, setVideoPath] = useState(null);
  const [location, setLocation] = useState(null);

  useEffect(() => {
    initializeApp();
  }, []);

  const initializeApp = async () => {
    try {
      await initDatabase();
      const granted = await requestNotificationPermissions();
      if (granted) {
        await scheduleNotifications();
      }
    } catch (error) {
      console.error("Failed to initialize app:", error);
    }
  };

  const handleSaveEmotion = async () => {
    if (!selectedEmotion) {
      Alert.alert("Error", "Please select an emotion!");
      return;
    }

    try {
      const currentLocation = await getCurrentLocation();

      const emotionRecord = {
        emotion: selectedEmotion,
        intensity: intensity,
        note: note,
        latitude: currentLocation?.latitude,
        longitude: currentLocation?.longitude,
        videoPath: videoPath,
        timestamp: new Date().toISOString(),
      };

      await saveEmotion(emotionRecord);

      // Sync to backend
      await syncEmotionToBackend(emotionRecord);

      let successMessage = "Emotion recorded and synced!";
      if (currentLocation) {
        successMessage += `\nLocation: ${currentLocation.latitude.toFixed(4)}, ${currentLocation.longitude.toFixed(4)}`;
      }
      if (videoPath) {
        successMessage += "\nVlog saved!";
      }

      Alert.alert("Success", successMessage);
      setSelectedEmotion(null);
      setIntensity(5);
      setNote("");
      setVideoPath(null);
      setLocation(null);
    } catch (error) {
      Alert.alert("Error", "Failed to save emotion");
      console.error(error);
    }
  };

  const handleVideoRecorded = (uri) => {
    setVideoPath(uri);
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>How are you feeling?</Text>

        {/* Emotion Selection */}
        <View style={styles.emotionGrid}>
          {EMOTIONS.map((emotion) => (
            <TouchableOpacity
              key={emotion.name}
              style={[
                styles.emotionButton,
                { backgroundColor: emotion.color },
                selectedEmotion?.name === emotion.name && styles.selectedEmotion,
              ]}
              onPress={() => setSelectedEmotion(emotion)}
            >
              <Text style={styles.emoji}>{emotion.emoji}</Text>
              <Text style={styles.emotionName}>{emotion.name}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Intensity Slider */}
        {selectedEmotion && (
          <View style={styles.intensityContainer}>
            <Text style={styles.label}>Intensity: {intensity}/10</Text>
            <View style={styles.intensityButtons}>
              {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                <TouchableOpacity
                  key={num}
                  style={[
                    styles.intensityButton,
                    intensity === num && styles.selectedIntensity,
                  ]}
                  onPress={() => setIntensity(num)}
                >
                  <Text style={styles.intensityText}>{num}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Note Input */}
        {selectedEmotion && (
          <View style={styles.noteContainer}>
            <Text style={styles.label}>Add a note (optional)</Text>
            <TextInput
              style={styles.noteInput}
              placeholder="What's on your mind?"
              value={note}
              onChangeText={setNote}
              multiline
              numberOfLines={3}
            />
          </View>
        )}

        {/* Vlog Recorder */}
        {selectedEmotion && (
          <VlogRecorder onVideoRecorded={handleVideoRecorded} />
        )}

        {/* Video Status */}
        {videoPath && (
          <View style={styles.videoStatus}>
            <Text style={styles.videoStatusText}>✅ Vlog recorded</Text>
          </View>
        )}

        {/* Save Button */}
        {selectedEmotion && (
          <TouchableOpacity style={styles.saveButton} onPress={handleSaveEmotion}>
            <Text style={styles.saveButtonText}>Save Emotion 💾</Text>
          </TouchableOpacity>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 24,
    textAlign: "center",
    color: "#2C3E50",
  },
  emotionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  emotionButton: {
    width: "48%",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  selectedEmotion: {
    borderWidth: 3,
    borderColor: "#2C3E50",
  },
  emoji: {
    fontSize: 40,
    marginBottom: 8,
  },
  emotionName: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  intensityContainer: {
    marginBottom: 24,
  },
  label: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 12,
    color: "#2C3E50",
  },
  intensityButtons: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },
  intensityButton: {
    width: "18%",
    padding: 12,
    backgroundColor: "#E9ECEF",
    borderRadius: 8,
    alignItems: "center",
    marginBottom: 8,
  },
  selectedIntensity: {
    backgroundColor: "#4ECDC4",
  },
  intensityText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#2C3E50",
  },
  noteContainer: {
    marginBottom: 24,
  },
  noteInput: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#DEE2E6",
    minHeight: 80,
    textAlignVertical: "top",
  },
  videoStatus: {
    backgroundColor: "#D4EDDA",
    padding: 12,
    borderRadius: 8,
    marginVertical: 8,
    alignItems: "center",
  },
  videoStatusText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#155724",
  },
  saveButton: {
    backgroundColor: "#4ECDC4",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  saveButtonText: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
});
