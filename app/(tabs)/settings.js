import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from "react-native";
import { useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function HistoryScreen() {
  const [emotions, setEmotions] = useState([]);
  const [stats, setStats] = useState({});

  useEffect(() => {
    loadEmotions();
  }, []);

  const loadEmotions = async () => {
    try {
      const data = await AsyncStorage.getItem("emotions");
      if (data) {
        const parsedEmotions = JSON.parse(data);
        setEmotions(parsedEmotions.reverse()); // Show newest first
        calculateStats(parsedEmotions);
      }
    } catch (error) {
      console.error("Failed to load emotions:", error);
    }
  };

  const calculateStats = (emotionData) => {
    const stats = {};
    emotionData.forEach((record) => {
      const emotionName = record.emotion.name;
      stats[emotionName] = (stats[emotionName] || 0) + 1;
    });
    setStats(stats);
  };

  const exportData = async () => {
    try {
      const data = await AsyncStorage.getItem("emotions");
      if (!data) {
        Alert.alert("No Data", "No emotions recorded yet!");
        return;
      }

      const emotions = JSON.parse(data);
      const jsonString = JSON.stringify(emotions, null, 2);

      // For development, just show the data
      Alert.alert(
        "Export Data",
        `Total records: ${emotions.length}\n\nData will be saved to data folder on build.`,
        [
          {
            text: "OK",
            onPress: () => console.log("Data:", jsonString),
          },
        ]
      );
    } catch (error) {
      Alert.alert("Error", "Failed to export data");
      console.error(error);
    }
  };

  const clearAllData = () => {
    Alert.alert(
      "Clear All Data",
      "Are you sure you want to delete all emotion records?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            await AsyncStorage.removeItem("emotions");
            setEmotions([]);
            setStats({});
            Alert.alert("Success", "All data cleared!");
          },
        },
      ]
    );
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getTopEmotion = () => {
    if (Object.keys(stats).length === 0) return null;
    return Object.entries(stats).sort((a, b) => b[1] - a[1])[0];
  };

  const topEmotion = getTopEmotion();

  return (
    <ScrollView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Emotion History</Text>

        {/* Stats Section */}
        {emotions.length > 0 && (
          <View style={styles.statsContainer}>
            <Text style={styles.statsTitle}>Your Stats</Text>
            <Text style={styles.statsText}>Total Records: {emotions.length}</Text>
            {topEmotion && (
              <Text style={styles.statsText}>
                Most Common: {topEmotion[0]} ({topEmotion[1]} times)
              </Text>
            )}
          </View>
        )}

        {/* Export Button */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity style={styles.exportButton} onPress={exportData}>
            <Text style={styles.exportButtonText}>📥 Export Data</Text>
          </TouchableOpacity>

          {emotions.length > 0 && (
            <TouchableOpacity style={styles.clearButton} onPress={clearAllData}>
              <Text style={styles.clearButtonText}>🗑️ Clear All</Text>
            </TouchableOpacity>
          )}
        </View>

        {/* Emotion List */}
        {emotions.length === 0 ? (
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No emotions recorded yet!</Text>
            <Text style={styles.emptySubtext}>
              Go to the Home tab to start tracking your emotions
            </Text>
          </View>
        ) : (
          <View style={styles.listContainer}>
            {emotions.map((record) => (
              <View
                key={record.id}
                style={[
                  styles.emotionCard,
                  { backgroundColor: record.emotion.color },
                ]}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardEmoji}>{record.emotion.emoji}</Text>
                  <View style={styles.cardInfo}>
                    <Text style={styles.cardEmotion}>
                      {record.emotion.name}
                    </Text>
                    <Text style={styles.cardDate}>
                      {formatDate(record.timestamp)}
                    </Text>
                  </View>
                  <Text style={styles.cardIntensity}>{record.intensity}/10</Text>
                </View>
                {record.note && (
                  <Text style={styles.cardNote}>{record.note}</Text>
                )}
              </View>
            ))}
          </View>
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
  statsContainer: {
    backgroundColor: "#FFFFFF",
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  statsTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 12,
    color: "#2C3E50",
  },
  statsText: {
    fontSize: 16,
    marginBottom: 6,
    color: "#495057",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 24,
  },
  exportButton: {
    flex: 1,
    backgroundColor: "#4ECDC4",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  exportButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  clearButton: {
    flex: 1,
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginLeft: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  clearButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  emptyContainer: {
    alignItems: "center",
    marginTop: 40,
  },
  emptyText: {
    fontSize: 20,
    color: "#6C757D",
    marginBottom: 8,
  },
  emptySubtext: {
    fontSize: 14,
    color: "#ADB5BD",
    textAlign: "center",
  },
  listContainer: {
    marginBottom: 20,
  },
  emotionCard: {
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: "row",
    alignItems: "center",
  },
  cardEmoji: {
    fontSize: 36,
    marginRight: 12,
  },
  cardInfo: {
    flex: 1,
  },
  cardEmotion: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  cardDate: {
    fontSize: 14,
    color: "#495057",
    marginTop: 2,
  },
  cardIntensity: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#2C3E50",
  },
  cardNote: {
    marginTop: 12,
    fontSize: 14,
    color: "#495057",
    fontStyle: "italic",
  },
});
