import { useState, useRef } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { CameraView, useCameraPermissions } from "expo-camera";
import * as MediaLibrary from "expo-media-library";

export default function VlogRecorder({ onVideoRecorded }) {
  const [cameraPermission, requestCameraPermission] = useCameraPermissions();
  const [mediaPermission, requestMediaPermission] = MediaLibrary.usePermissions();
  const [isRecording, setIsRecording] = useState(false);
  const [showCamera, setShowCamera] = useState(false);
  const cameraRef = useRef(null);

  const requestPermissions = async () => {
    if (!cameraPermission?.granted) {
      const result = await requestCameraPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "Camera permission is required to record vlogs");
        return false;
      }
    }

    if (!mediaPermission?.granted) {
      const result = await requestMediaPermission();
      if (!result.granted) {
        Alert.alert("Permission Required", "Media library permission is required to save vlogs");
        return false;
      }
    }

    return true;
  };

  const startRecording = async () => {
    const hasPermissions = await requestPermissions();
    if (!hasPermissions) return;

    setShowCamera(true);
  };

  const handleRecord = async () => {
    if (!cameraRef.current) return;

    try {
      setIsRecording(true);

      const video = await cameraRef.current.recordAsync({
        maxDuration: 1,
      });

      const asset = await MediaLibrary.createAssetAsync(video.uri);

      setShowCamera(false);
      setIsRecording(false);

      onVideoRecorded(asset.uri);
      Alert.alert("Success", "1-second vlog recorded!");
    } catch (error) {
      console.error("Recording error:", error);
      Alert.alert("Error", "Failed to record vlog");
      setIsRecording(false);
    }
  };

  const cancelRecording = () => {
    setShowCamera(false);
    setIsRecording(false);
  };

  if (showCamera) {
    return (
      <View style={styles.cameraContainer}>
        <CameraView
          ref={cameraRef}
          style={styles.camera}
          facing="front"
          mode="video"
        >
          <View style={styles.cameraOverlay}>
            <Text style={styles.cameraTitle}>Record 1-second vlog</Text>
            {!isRecording && (
              <View style={styles.buttonRow}>
                <TouchableOpacity style={styles.cancelButton} onPress={cancelRecording}>
                  <Text style={styles.buttonText}>Cancel</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.recordButton} onPress={handleRecord}>
                  <View style={styles.recordButtonInner} />
                </TouchableOpacity>
              </View>
            )}
            {isRecording && (
              <View style={styles.recordingIndicator}>
                <View style={styles.recordingDot} />
                <Text style={styles.recordingText}>Recording...</Text>
              </View>
            )}
          </View>
        </CameraView>
      </View>
    );
  }

  return (
    <TouchableOpacity style={styles.vlogButton} onPress={startRecording}>
      <Text style={styles.vlogButtonText}>📹 Record 1-second vlog</Text>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  vlogButton: {
    backgroundColor: "#FF6B6B",
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    marginVertical: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  vlogButtonText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FFFFFF",
  },
  cameraContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1000,
  },
  camera: {
    flex: 1,
  },
  cameraOverlay: {
    flex: 1,
    backgroundColor: "transparent",
    justifyContent: "space-between",
    padding: 20,
  },
  cameraTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    marginTop: 40,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 40,
  },
  cancelButton: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 25,
  },
  buttonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "bold",
  },
  recordButton: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: "#FFFFFF",
    justifyContent: "center",
    alignItems: "center",
  },
  recordButtonInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FF0000",
  },
  recordingIndicator: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 40,
  },
  recordingDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#FF0000",
    marginRight: 8,
  },
  recordingText: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "bold",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 10,
  },
});
