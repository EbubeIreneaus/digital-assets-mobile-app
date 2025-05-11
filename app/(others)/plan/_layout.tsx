import Colors from "@/lib/color";
import { Stack } from "expo-router";
import { StatusBar } from "react-native";

export default function RootLayout() {
  return (
    <>
      <Stack>
        <Stack.Screen
          name="tradingPlan"
          options={({ navigation }) => ({
            title: "Market Plan",
            headerStyle: {
              backgroundColor: Colors.primary,
            },
            headerTitleStyle: {
              color: "white",
            },
            headerTitleAlign: "center",
            headerBackVisible: false,
          })}
        />
        <Stack.Screen name="myPlan" options={{ headerShown: false }} />
      </Stack>
    </>
  );
}
