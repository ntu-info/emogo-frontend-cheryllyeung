import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
  }),
});

export const requestNotificationPermissions = async () => {
  const { status: existingStatus } = await Notifications.getPermissionsAsync();
  let finalStatus = existingStatus;

  if (existingStatus !== "granted") {
    const { status } = await Notifications.requestPermissionsAsync();
    finalStatus = status;
  }

  if (finalStatus !== "granted") {
    alert("Failed to get push notification permissions!");
    return false;
  }

  if (Platform.OS === "android") {
    await Notifications.setNotificationChannelAsync("default", {
      name: "default",
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: "#4ECDC4",
    });
  }

  return true;
};

export const scheduleNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();

  const times = [
    { hour: 10, minute: 0 },
    { hour: 15, minute: 0 },
    { hour: 20, minute: 0 },
  ];

  const scheduledIds = [];

  for (const time of times) {
    const id = await Notifications.scheduleNotificationAsync({
      content: {
        title: "How are you feeling? 🤔",
        body: "Take a moment to record your emotions",
        data: { type: "emotion-reminder" },
      },
      trigger: {
        hour: time.hour,
        minute: time.minute,
        repeats: true,
      },
    });
    scheduledIds.push(id);
  }

  return scheduledIds;
};

export const cancelAllNotifications = async () => {
  await Notifications.cancelAllScheduledNotificationsAsync();
};

export const getScheduledNotifications = async () => {
  return await Notifications.getAllScheduledNotificationsAsync();
};
