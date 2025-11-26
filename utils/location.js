import * as Location from "expo-location";
import { Alert } from "react-native";

export const requestLocationPermissions = async () => {
  const { status } = await Location.requestForegroundPermissionsAsync();

  if (status !== "granted") {
    Alert.alert(
      "Permission Required",
      "Location permission is required to track where you record your emotions"
    );
    return false;
  }

  return true;
};

export const getCurrentLocation = async () => {
  try {
    const hasPermission = await requestLocationPermissions();
    if (!hasPermission) {
      return null;
    }

    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Balanced,
    });

    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  } catch (error) {
    console.error("Error getting location:", error);
    return null;
  }
};
