import Colors from "@/lib/color";
import { Stack } from "expo-router";
import { StatusBar, View } from "react-native";
import "../global.css";
import ThemeContext, { ThemeProvider } from "@/context/themeContext";


export default function RootLayout() {
  return (
    <>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      
       <ThemeProvider>
        <Stack>
          <Stack.Screen name="index" options={{ headerShown: false }} />
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
       </ThemeProvider>
      
    </>
  );
}
