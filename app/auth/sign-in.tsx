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

const SignIn = () => {
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? Colors.textLight : Colors.textDark;
  const bgColor = colorScheme === "dark" ? Colors.dark : Colors.light;
  const [form, setForm] = useState({
    email: '',
    password: ''
  });
  return (
    <View
      style={[
        styles.container,
        {
          backgroundColor:
            colorScheme === "dark" ? Colors.bgDark : Colors.bgLight,
        },
      ]}
    >
      <View>
        <Text style={{ fontSize: 32, fontWeight: "bold", color: textColor }}>
          Sign In
        </Text>
        <Text style={[styles.headDesc, { color: textColor }]}>
          Login your Digital Assets Growth details to continue.
        </Text>
      </View>

      <View style={styles.formContainer}>
        <View>
          <Text style={[styles.label, { color: textColor }]}>Email</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: bgColor, color: textColor },
            ]}
            placeholder="Enter your Email"
            secureTextEntry={true}
            placeholderTextColor={textColor}
            value={form.email}
            onChangeText={(val) => setForm({ ...form, email: val })}
          />
        </View>
        <View style={{marginTop: 14}}>
          <Text style={[styles.label, { color: textColor }]}>Password</Text>
          <TextInput
            style={[
              styles.input,
              { backgroundColor: bgColor, color: textColor },
            ]}
            placeholder="Enter your password"
            placeholderTextColor={textColor}
            value={form.password}
            onChangeText={(val) => setForm({ ...form, password: val })}
          />
        </View>
      </View>
            
      <View
        style={[
          styles.nextContainer,
          {
            backgroundColor:
              colorScheme == "dark" ? Colors.bgDark : Colors.bgLight,
          },
        ]}
      >
        <Text
          style={[
            styles.nextText,
            {
              color: textColor,
              backgroundColor:
                colorScheme == "dark" ? Colors.bgDark : Colors.bgLight,
            },
          ]}
        >
          
        </Text>

        <Pressable style={styles.nextButton} onPress={()=>alert('clicked')}>
          <Text>Sign in</Text>
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
    color: Colors.primary,
    marginBottom: 10,
    width: "100%",
    paddingHorizontal: 10,
    backgroundColor: "Black",
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
