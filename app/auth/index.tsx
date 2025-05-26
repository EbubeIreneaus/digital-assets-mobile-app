import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, Image } from "react-native";
import Colors from "@/lib/color";
import AsyncStorage from "@react-native-async-storage/async-storage";
import PagerView from "react-native-pager-view";
import useAppTheme from "@/lib/appTheme";

const AuthIndex = () => {
  const {textColor, primaryColor} = useAppTheme()
  const [slide, setSlide] = useState(0)
  // clear token incase of signout
  useEffect(() => {
    async function clearToken() {
      if (await AsyncStorage.getItem("token")) {
        await AsyncStorage.removeItem("token");
      }
    }

    clearToken();
  }, []);

  return (
    <View className="bg-bgLight dark:bg-bgDark flex-1">
      <View className="justify-center items-center" style={{flex: 1/3}}>
        <Image
          source={require("@/assets/images/icon-tr.png")}
          style={{ width: 120, height: 120 }}
        />
      </View>

      <View className="px-3" style={{flex: 1/ 3}}>
        <PagerView  onPageScroll={(pos) => setSlide(pos.nativeEvent.position)} style={{ height: 300 }} pageMargin={10} initialPage={slide}>
          <View key="1" className="rounded-xl">
            <Image
              source={require("@/assets/images/extra/stock.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              className="rounded-xl"
            />
          </View>

          <View key="2" className="rounded-xl">
            <Image
              source={require("@/assets/images/extra/crypto.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              className="rounded-xl"
            />
          </View>

           <View key="3" className="rounded-xl">
            <Image
              source={require("@/assets/images/extra/realestate.jpg")}
              style={{ width: "100%", height: "100%", objectFit: "contain" }}
              className="rounded-xl"
            />
          </View>
        </PagerView>
        <View className="flex-row justify-center gap-x-3 py-3 mt-1">
          <View style={[styles.indicator, {backgroundColor: slide == 0?textColor: primaryColor}]} ></View>
           <View style={[styles.indicator, {backgroundColor: slide == 1?textColor: primaryColor}]} ></View>
            <View style={[styles.indicator, {backgroundColor: slide == 2?textColor: primaryColor}]} ></View>
        </View>
      </View>

      <View style={[{ flex: 1 / 3 }]} className="items-center justify-end pb-8">
        <Link
          href="/auth/sign-up"
          style={styles.link}
          className="bg-light dark:bg-dark"
        >
          <Text style={styles.text} className="text-dark dark:text-light">
            Create Account
          </Text>
        </Link>

        <Link
          href="/auth/sign-in"
          style={styles.link}
          className="bg-light dark:bg-dark mt-[15px]"
        >
          <Text style={styles.text} className="text-dark dark:text-light">
            Already have an account? sign in
          </Text>
        </Link>
      </View>
    </View>
  );
};

export default AuthIndex;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    width: "100%",
  },
  text: {
    fontSize: 16,
    fontWeight: "bold",
  },
  link: {
    width: 350,
    height: 55,
    justifyContent: "center",
    alignItems: "center",
    textAlign: "center",
    textAlignVertical: "center",
    borderRadius: 5,
  },
  indicator: {
    width: 22,
    height: 20,
    borderRadius: 50
  }
});
