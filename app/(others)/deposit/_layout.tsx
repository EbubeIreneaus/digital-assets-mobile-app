import Colors from "@/lib/color";
import { FontAwesome } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, StatusBar, Text } from "react-native";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen
        name="index"
        options={({ navigation }) => ({
          title: "Deposit",
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

      <Stack.Screen
        name="checkout"
        options={({ navigation }) => ({
          title: "Confirm Deposit",
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
    </Stack>
  );
}
