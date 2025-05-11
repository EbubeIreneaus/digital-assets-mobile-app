import React, { useState } from "react";
import {
  View,
  StyleSheet,
  TextInput,
  Text,
  useColorScheme,
  Pressable,
} from "react-native";
import Colors from "@/lib/color";
import { Link } from "expo-router";
import FontAwesome5 from "@expo/vector-icons/FontAwesome5";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";

const SignIn = () => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  async function handleSubmit() {
    setIsLoading(true);
    setError(null);
    if (!form.email || !form.password) {
      setIsLoading(false);
      return setError("Username and password are required.");
    }
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/`, {
        method: "POST",
        body: JSON.stringify(form),
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data: any = await res.json();

      if (data.success) {
        AsyncStorage.setItem("token", data.token);
        if (!data.email_verified) {
          return router.push(`/auth/otp-verify?email=${data.email}`);
        }
        return router.replace(`/`);
      }

      return setError(data.msg);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <View style={styles.container} className="bg-bgLight dark:bg-bgDark ">
      <View>
        <Text
          style={{ fontSize: 32, fontWeight: "bold" }}
          className="text-dark dark:text-light"
        >
          Sign In
        </Text>
        <Text style={styles.headDesc} className="text-dark dark:text-light">
          Login your Digital Assets Growth details to continue.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View>
          <Text
            style={styles.label}
            className="text-dark dark:text-light ps-2 mb-1.5"
          >
            Email
          </Text>
          <TextInput
            style={styles.input}
            className="text-dark dark:text-light bg-light dark:bg-dark rounded-md"
            placeholder="Enter your username"
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
          />
        </View>
        <View style={{ marginTop: 14 }}>
          <Text
            style={[styles.label]}
            className="text-dark dark:text-light ps-2 mb-1.5"
          >
            Password
          </Text>
          <TextInput
            style={styles.input}
            className="dark:text-light bg-light dark:bg-dark  rounded-md"
            placeholder="Enter your password"
            value={form.password}
            onChangeText={(val) => setForm({ ...form, password: val })}
            secureTextEntry={true}
          />
        </View>

        <Link href="/" className="mt-4">
          <Text className="text-primary font-semibold text-center text-lg">
            Forgot Password?
          </Text>
        </Link>
      </View>

      <View
        style={[styles.nextContainer]}
        className="bg-bgLight dark:bg-bgDark"
      >
        <Text
          style={[
            styles.nextText,
            {
              color: "red",
              textTransform: "capitalize",
            },
          ]}
          className="bg-bgLight dark:bg-bgDark"
        >
          {" "}
          {error}
        </Text>

        <Pressable
          style={styles.nextButton}
          onPress={() => handleSubmit()}
          disabled={isLoading}
        >
          {isLoading && (
            <FontAwesome5
              name="spinner"
              size={20}
              className="!text-light animate-spin"
            />
          )}
          <Text className="text-light"> Sign in</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default SignIn;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  formContainer: {
    flex: 1,
    marginTop: 35,
  },
  input: {
    height: 50,
    borderColor: "gray",

    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 10,
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 5,
  },

  headDesc: {
    fontSize: 16,
    marginTop: 10,
  },
  nextContainer: {
    flex: 1 / 4,
    justifyContent: "center",
    alignItems: "center",
    position: "fixed",
    zIndex: 99,
  },
  nextButton: {
    width: "100%",
    backgroundColor: Colors.primary,
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  nextText: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "500",
    width: "100%",
  },
  linkText: {
    color: Colors.primary,
  },
});
