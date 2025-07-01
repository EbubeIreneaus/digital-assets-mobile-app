import useAppTheme from "@/lib/appTheme";
import Colors from "@/lib/color";
import { MaterialIcons } from "@expo/vector-icons";
import { router, Stack } from "expo-router";
import { StatusBar, TouchableOpacity } from "react-native";

export default function RootLayout() {
  const { primaryColor, textColor } = useAppTheme();
  return (
    <>
      <Stack>
        <Stack.Screen name="deposit" options={{ headerShown: false }} />
        <Stack.Screen name="plan" options={{ headerShown: false }} />
        <Stack.Screen name="convert" options={{ headerShown: false }} />
        <Stack.Screen name="transfer" options={{ headerShown: false }} />
        <Stack.Screen name="transfer02" options={{ headerShown: false }} />
        <Stack.Screen name="withdrawal" options={{ headerShown: false }} />
        <Stack.Screen name="booking" options={{ headerShown: false }} />
        <Stack.Screen name="LiveChat" options={{ headerShown: false }} />
        <Stack.Screen
          name="TransactionDetails"
          options={({ navigation }) => ({
            title: "Transaction Details",
            headerStyle: {
              backgroundColor: primaryColor,
            },
            headerTitleStyle: {
              color: textColor,
            },
            headerTitleAlign: "center",
            headerLeft(props) {
              return (
                <>
                  {router.canGoBack() && (
                    <TouchableOpacity
                      className="p-3"
                      onPressOut={() => router.back()}
                    >
                      <MaterialIcons
                        name="chevron-left"
                        size={20}
                        color={textColor}
                      />
                    </TouchableOpacity>
                  )}
                </>
              );
            },
          })}
        />

      </Stack>
    </>
  );
}
