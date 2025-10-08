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
        name="SetPin"
        options={{
          title: "Reset Pin",
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
        name="EditInformation"
        options={({ navigation }) => ({
          title: "Personal Information",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="ChangePassword"
        options={({ navigation }) => ({
          title: "Change Password",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="ResetPassword"
        options={({ navigation }) => ({
          title: "Reset Password",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="VerifyUser"
        options={({ navigation }) => ({
          title: "OTP Verification",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="TermsOfService"
        options={({ navigation }) => ({
          title: "Terms Of Use",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="PrivacyPolicy"
        options={({ navigation }) => ({
          title: "Privacy and Policy",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

       <Stack.Screen
        name="OurService"
        options={({ navigation }) => ({
          title: "Service we Offer",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="DeleteAccount"
        options={({ navigation }) => ({
          title: "Delete My Account",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />
         <Stack.Screen
        name="Invitation"
        options={({ navigation }) => ({
          title: "Invite a Friend & Earn Rewards",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

      <Stack.Screen
        name="DocumentVerification"
        options={({ navigation }) => ({
          title: "Verify Account",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />
        <Stack.Screen
        name="NextOfKin"
        options={({ navigation }) => ({
          title: "Next Of Kin",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {
            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />

        <Stack.Screen
        name="AddNextOfKin"
        options={({ navigation }) => ({
          title: "Add Next Of Kin",
          headerStyle: {
            backgroundColor: Colors.primary,
          },
          headerTitleStyle: {

            color: "white",
          },
          headerTitleAlign: "center",
          headerBackVisible: false,
          headerLeft(props) {
            return (
              <TouchableOpacity onPressOut={() => router.back()}>
                <MaterialIcons
                  name="chevron-left"
                  size={25}
                  color={textColor}
                  className="p-2"
                />
              </TouchableOpacity>
            );
          },
        })}
      />
      <Stack.Screen name="(verifications)" options={{headerShown: false}} />
    </Stack>
  );
}
