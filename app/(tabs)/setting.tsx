import useAppTheme from "@/lib/appTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, RelativePathString } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Image,
  Text,
  Dimensions,
  TouchableOpacity,
  StyleSheet,
  RefreshControl,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import Toast from "react-native-simple-toast";
import { getToken } from "@/lib/authToken";
import LoaderScreen from "@/components/LoaderScreen";

const screenHeight = Dimensions.get("window").height;
const setting = () => {
    const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [imgSrc, setImgSrc] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false)
  const [user, setUser] = useState({
    fullname: "",
    profile_pics: "",
    document_verified: false,
    email_verified: false,
    tier: 1,
  });

  async function FetchData() {
    const token = await getToken();
    setIsLoading(true);
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/personal-information`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        return setUser(res);
      }
      Toast.show("unknown server error", Toast.LONG);
    } catch (error) {
      Toast.show("unexpected error, try again", Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    FetchData();
  }, []);

  useEffect(() => {
    if (user.profile_pics) {
      setImgSrc({ uri: process.env.EXPO_PUBLIC_API_URL + user.profile_pics });
    } else {
      setImgSrc(require("@/assets/images/user-placeholder.png"));
    }
  }, [user.profile_pics]);

  // launch and save image picker
  async function launchImagePicker() {
    try {
      const launcher = await ImagePicker.launchImageLibraryAsync({
        allowsEditing: true,
        quality: 1,
        mediaTypes: ["images"],
      });

      if (launcher.canceled) {
        return;
      }
      setImgSrc({ uri: launcher.assets[0].uri });

      const token = await getToken();

      const formData = new FormData();
      formData.append("file", {
        uri: launcher.assets[0].uri,
        name: launcher.assets[0].fileName,
        type: launcher.assets[0].mimeType,
      } as any);

      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/update-image`,
        {
          method: "POST",
          body: formData,
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await req.json();

      if (res.success) {
        return Toast.show("Image saved successfully", Toast.LONG);
      }
      Toast.show("server error, unable to save image", Toast.LONG);
    } catch (error) {
      console.log("error", error);
      Toast.show("unknown error occured, unable to save image", Toast.LONG);
    }
  }

 const refresh = useCallback(async () => {
    await FetchData()
    setRefreshing(false)
  }, [])

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight " refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor} />}>
      <View className="flex-1 dark:bg-bgDark bg-bgLight px-5">
        <View
          className=" rounded-lg  justify-center py-5 px-2"
          style={{ minHeight: screenHeight }}
        >
          <View className="mb-8 items-center">
            <View
              style={{ position: "relative" }}
              className="mb-3 w-[100px] rounded-full"
            >
              <Image
                source={imgSrc}
                className="mx-auto  border-4 border-primary rounded-full"
                style={{ width: 100, height: 100 }}
              />
              <TouchableOpacity
                onPress={() => launchImagePicker()}
                className="justify-center !rounded-full items-center dark:bg-slate-950/30 bg-slate-300/30"
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: 100,
                  height: 100,
                }}
              >
                <MaterialIcons
                  name="camera-alt"
                  size={25}
                  className="py-1"
                  color={textColor}
                />
              </TouchableOpacity>
            </View>
            <View className="flex-row items-center">
              <Text
                style={{ color: textColor }}
                className="text-lg font-bold text-center"
              >
                {user.fullname}
              </Text>
              {user.document_verified && (
                <MaterialIcons
                  name="verified"
                  size={20}
                  className="!text-blue-500"
                />
              )}
            </View>
          </View>

          <View className="dark:bg-dark bg-light p-3 rounded-lg mb-3">
            <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-5">
              Account Settings
            </Text>
            <View>
              {AccountSettingLinks.map((link) => (
                <SingleLink
                  label={link.label}
                  href={link.href}
                  key={link.label}
                />
              ))}
            </View>
          </View>

          <View className="dark:bg-dark bg-light p-3 rounded-lg mb-3">
            <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-5">
              Verifications
            </Text>
            <View>
              {user.tier == 1 && (
                <Link href="/Tier2Intro" asChild>
                  <TouchableOpacity className="flex-row justify-between items-center px-3 py-5  mb-1 rounded-xl">
                    <Text
                      className="font-semibold "
                      style={{ color: textColor }}
                    >
                      Upgrade Account
                    </Text>

                    <TouchableOpacity
                      style={styles.pillContainer}
                      className="bg-gray-500"
                    >
                      <Text className="text-light">Tier 1</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Link>
              )}

              {user.tier == 2 && (
                <Link href="/Tier3VerificationIntro" asChild>
                  <TouchableOpacity className="flex-row justify-between items-center px-3 py-5  mb-1 rounded-xl">
                    <Text
                      className="font-semibold "
                      style={{ color: textColor }}
                    >
                      Upgrade Account
                    </Text>
                    <TouchableOpacity
                      style={styles.pillContainer}
                      className="bg-primary"
                    >
                      <Text className="text-light">Tier 2</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                </Link>
              )}

              {user.tier == 3 && (
                <TouchableOpacity className="flex-row justify-between items-center px-3 py-5  mb-1 rounded-xl">
                  <Text className="font-semibold " style={{ color: textColor }}>
                    Upgrade Account
                  </Text>
                  <TouchableOpacity
                    style={styles.pillContainer}
                    className="bg-primary"
                  >
                    <Text className="text-light">Tier 3</Text>
                  </TouchableOpacity>
                </TouchableOpacity>
              )}

              <Link href="/" asChild>
                <TouchableOpacity
                  disabled={user.email_verified}
                  className="flex-row justify-between items-center px-3 py-5  mb-1 rounded-xl"
                >
                  <Text className="font-semibold " style={{ color: textColor }}>
                    Email Verification
                  </Text>
                  {user.email_verified ? (
                    <MaterialIcons
                      size={20}
                      style={{ color: "green" }}
                      name="check-circle"
                    />
                  ) : (
                    <MaterialIcons
                      size={20}
                      style={{ color: textColor }}
                      name="chevron-right"
                    />
                  )}
                </TouchableOpacity>
              </Link>
            </View>
          </View>

          <View className="dark:bg-dark bg-light p-3 rounded-lg mb-5">
            <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-5">
              Legal
            </Text>
            <View>
              <SingleLink label="Our Service" href="/OurService" />
              <SingleLink label="Terms of Use" href="/TermsOfService" />
              <SingleLink label="Privacy & Policy" href="/PrivacyPolicy" />
            </View>
          </View>

          <View className="dark:bg-dark bg-light p-3 rounded-lg">
            <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-5">
              Security
            </Text>

            <View>
              <Link asChild href="/auth">
                <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg mb-5">
                  <View className="flex-row gap-3 items-center">
                    <MaterialIcons
                      name="logout"
                      size={20}
                      style={{ color: textColor }}
                    />
                    <Text className="font-semibold dark:text-light">
                      Sign Out
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    style={{ color: textColor }}
                  />
                </TouchableOpacity>
              </Link>

              <Link asChild href="/DeleteAccount">
                <TouchableOpacity className="flex-row items-center justify-between p-3 rounded-lg">
                  <View className="flex-row gap-3 items-center">
                    <MaterialIcons
                      name="delete-forever"
                      size={20}
                      style={{ color: "red" }}
                    />
                    <Text className="font-semibold dark:text-light">
                      Delete Account
                    </Text>
                  </View>
                  <MaterialIcons
                    name="chevron-right"
                    size={20}
                    style={{ color: textColor }}
                  />
                </TouchableOpacity>
              </Link>
            </View>
          </View>
        </View>
      </View>

      {isLoading && <LoaderScreen />}
    </ScrollView>
  );
};

export default setting;

const styles = StyleSheet.create({
  pillContainer: {
    borderRadius: 20, // Adjust as needed, half of the height
    paddingVertical: 1,
    paddingHorizontal: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 16,
  },
});

export function SingleLink({ label, href }: { label: string; href: string }) {
  const { textColor } = useAppTheme();

  return (
    <Link href={href as RelativePathString} asChild>
      <TouchableOpacity className="flex-row justify-between items-center px-3 py-5  mb-1 rounded-xl">
        <Text className="font-semibold " style={{ color: textColor }}>
          {label}
        </Text>
        <MaterialIcons
          size={20}
          style={{ color: textColor }}
          name="chevron-right"
        />
      </TouchableOpacity>
    </Link>
  );
}

const AccountSettingLinks = [
  { label: "Personal Information", href: "/EditInformation" },
  { label: "Change Password", href: "/ChangePassword" },
  { label: "Reset Pin", href: "/SetPin" },
  { label: "Next of Kin", href: "/NextOfKin" },
];
