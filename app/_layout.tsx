import Colors from "@/lib/color";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";
import "../global.css";

export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="auth" options={{ headerShown: false }} />
          <Stack.Screen name="(settings)" options={{ headerShown: false }} />
          {/* <Stack.Screen name="(profile)" options={{ headerShown: false }} /> */}
          <Stack.Screen name="(others)" options={{ headerShown: false }} />
          <Stack.Screen
            name="+not-found"
            options={{ title: "404 Page Not Found" }}
          />
        </Stack>
      
    </>
  );
}
