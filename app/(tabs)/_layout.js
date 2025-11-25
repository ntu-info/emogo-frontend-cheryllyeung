import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs>
      {/* First tab uses the index.js screen in this folder */}
      <Tabs.Screen
        name="index"
        options={{
          title: "Track",
        }}
      />
      <Tabs.Screen
        name="settings"
        options={{
          title: "History",
        }}
      />
    </Tabs>
  );
}
