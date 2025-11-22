import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";

export default function RootLayout() {
  return (
    <>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="(tabs)" />
        <Stack.Screen name="asset/[id]" options={{ presentation: "modal", animation: "fade" }} />
        <Stack.Screen name="album/[id]" options={{ headerTitle: "Album" }} />
      </Stack>
      <StatusBar style="light" />
    </>
  );
}
