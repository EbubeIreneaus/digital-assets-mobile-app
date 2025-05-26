import useAppTheme from "@/lib/appTheme";
import Colors from "@/lib/color";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { Pressable, StatusBar, Text, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const { textColor } = useAppTheme();
  return (
    <Stack>
      <Stack.Screen
        name="Tier2Intro"
        options={{
          title: "Tier 2 Requirement",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity className="p-2" onPressOut={() => router.back()}>
              <MaterialIcons name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="Tier2Verification"
        options={{
          title: "Tier 2 Verification",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity className="p-2" onPressOut={() => router.back()}>
              <MaterialIcons name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="Tier3VerificationIntro"
        options={{
          title: "Tier 3 Verification",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity className="p-2" onPressOut={() => router.back()}>
              <MaterialIcons name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />

      <Stack.Screen
        name="Tier3Verification"
        options={{
          title: "Tier 3 Verification",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity className="p-2" onPressOut={() => router.back()}>
              <MaterialIcons name="chevron-left" size={25} color="white" />
            </TouchableOpacity>
          ),
        }}
      />
      {/* <Stack.Screen name="(verifications)" options={{headerShown: false}} /> */}
    </Stack>
  );
}
