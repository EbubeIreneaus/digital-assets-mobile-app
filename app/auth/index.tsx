import { Link } from "expo-router";
import React from "react";
import { Text, View, StyleSheet, Image} from "react-native";
import Colors from "@/lib/color";

const AuthIndex = () => {
  return (
    <View className="bg-bgLight dark:bg-bgDark flex-1 justify-center items-center">
      <View className="flex-1 justify-center items-center">
        <Image
          source={require('@/assets/images/logo-tr.png')}
          style={{ width: 230, height: 180 }}
        />
        <Text
          className="text-primary font-semibold text-center text-xl"
        >
          Welcome to Digital Assets
        </Text>
      <View>

      </View>
      </View>
      

      <View style={[{ flex: 1 / 3 }]}>
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
});
