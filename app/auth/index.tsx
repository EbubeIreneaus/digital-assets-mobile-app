import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, useColorScheme } from "react-native";
import Colors from "@/lib/color";

const AuthIndex = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? Colors.textLight : Colors.textDark;
  const bgColor = colorScheme === "dark" ? Colors.dark : Colors.light;

  return (
    <View style={[styles.container, { backgroundColor: colorScheme === "dark" ? Colors.bgDark : Colors.bgLight }]}>
      <View style={{ flex: 1 }}></View>

      <View style={[{ flex: 1 / 3 }]}>
        <Link
          href="/auth/sign-up"
          style={[styles.link, { backgroundColor: bgColor }]}
        >
          <Text
            style={[
              styles.text,
              { color: textColor},
            ]}
          >
            Create Account
          </Text>
        </Link>

        <Link
          href="/auth/sign-up"
          style={[
            styles.link,
            { marginTop: 15, backgroundColor: bgColor },
          ]}
        >
          <Text
            style={[
              styles.text,
              { color: textColor },
            ]}
          >
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
});
