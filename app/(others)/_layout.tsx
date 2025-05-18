import Colors from "@/lib/color";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen name="deposit" options={{ headerShown: false }} />
        <Stack.Screen name="plan" options={{ headerShown: false }} />
        <Stack.Screen name="convert" options={{ headerShown: false }} />
        <Stack.Screen name="transfer" options={{ headerShown: false }} />
        <Stack.Screen name="transfer02" options={{ headerShown: false }} />
        <Stack.Screen name="withdrawal" options={{ headerShown: false }} />
        {/* <Stack.Screen name="" options={{ headerShown: false }} /> */}
      </Stack>
    </>
  );
}
