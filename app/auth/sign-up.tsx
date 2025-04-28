import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  Pressable,
  useColorScheme,
  ScrollView,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import Colors from "@/lib/color";
import { Link } from "expo-router";
import { COUNTRIES } from "@/lib/countryList";
import z, { Schema } from "zod";

const InfoSchema = z.object({
  firstname: z.string().min(1, { message: "firstname is required" }),
  lastname: z.string().min(1, { message: "lastname is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  country: z.string().min(1, { message: "Country is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
});

const PasswordSchema = z
  .object({
    password: z.coerce.string().min(6, { message: "Password must be 6 characters long" }),
    confirm: z.coerce.string().min(6, { message: "Confirm password is required" }),
  })
  .refine(
    (value) => {
      return value.password === value.confirm;
    },
    {
      message: "Password does not match",
      path: ["confirm"],
    }
  );

const SignUp = () => {
  const [step, setStep] = useState(1);
  const colorScheme = useColorScheme();
  const textColor = colorScheme === "dark" ? Colors.textLight : Colors.textDark;
  const bgColor = colorScheme === "dark" ? Colors.dark : Colors.light;
  
  const [accountType, setAccountType] = useState("personal");

  const [infoData, setInfoData] = useState({
    firstname: "",
    lastname: "",
    email: "",
    country: "",
    phone: "",
  });

  const [psw, setPsw] = useState({
    password: "",
    confirm: "",
  });

  function handleInfoData(val: string, field: keyof typeof infoData) {
    setInfoData({ ...infoData, [field]: val });
  }

  function nextStep() {
    let res;
    switch (step) {
      case 1:
        setStep(2);
        break;

      case 2:
        res = InfoSchema.safeParse(infoData);
        if (res.error) {
          alert(res.error.issues[0].message);
        } else {
          setStep(3);
        }
        break;

      case 3:
        res = PasswordSchema.safeParse(psw);
        if (res.error) {
          alert(res.error.issues[0].message);
        } else {
        }
        break;
    }
  }

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
      <Text style={{ fontSize: 32, fontWeight: "bold", color: textColor }}>
        Sign up
      </Text>
      <Text style={[styles.headDesc, { color: textColor }]}>
        Create a Digital Assets Growth profile with a few details.
      </Text>
      <Text style={[styles.headDesc, { color: Colors.primary }]}>
        Step {step} / 3
      </Text>

      {/* Step 1 displaying account type selection */}
      {step === 1 && (
        <View style={styles.formContainer}>
          <Text style={[styles.label, { color: textColor }]}>Account Type</Text>
          <View style={[styles.input, { backgroundColor: bgColor }]}>
            <Picker style={{ color: textColor }} dropdownIconColor={textColor}>
              <Picker.Item label="Personal" value="personal" />
              <Picker.Item label="Joint" value="joint" />
              <Picker.Item label="Organization" value="organization" />
              <Picker.Item label="Visa" value="visa" />
              <Picker.Item label="Retirement" value="retirement" />
            </Picker>
          </View>
        </View>
      )}

      {/* Step 2 displaying account type selection */}
      {step === 2 && (
        <ScrollView style={[styles.formContainer, { height: 200 }]}>
          <View>
            <Text style={[styles.label, { color: textColor }]}>Firstname</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your firstname"
              placeholderTextColor={textColor}
              value={infoData.firstname}
              onChangeText={(val) => handleInfoData(val, "firstname")}
            />
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={[styles.label, { color: textColor }]}>Lastname</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your lastname"
              placeholderTextColor={textColor}
              value={infoData.lastname}
              onChangeText={(val) => handleInfoData(val, "lastname")}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: textColor }]}>Email</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your email"
              inputMode="email"
              placeholderTextColor={textColor}
              value={infoData.email}
              onChangeText={(val) => handleInfoData(val, "email")}
            />
          </View>

          <View>
            <Text style={[styles.label, { color: textColor }]}>Country</Text>
            <View style={[styles.input, { backgroundColor: bgColor }]}>
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                onValueChange={(val: string, _) =>
                  handleInfoData(val, "country")
                }
              >
                {COUNTRIES.map((country) => (
                  <Picker.Item
                    label={country.name}
                    value={country.name}
                    key={country.name}
                  />
                ))}
              </Picker>
            </View>
          </View>

          <View style={{ marginVertical: 10 }}>
            <Text style={[styles.label, { color: textColor }]}>Phone</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your phone number"
              inputMode="tel"
              placeholderTextColor={textColor}
              value={infoData.phone}
              onChangeText={(val) => handleInfoData(val, "phone")}
            />
          </View>
        </ScrollView>
      )}

      {/* Step 3 password secton */}
      {step === 3 && (
        <View style={styles.formContainer}>
          <View>
            <Text style={[styles.label, { color: textColor }]}>Password</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your password"
              secureTextEntry={true}
              placeholderTextColor={textColor}
              value={psw.password}
              onChangeText={(val => setPsw({...psw, password: val}))}
            />
          </View>

          <View style={{ marginVertical: 14 }}>
            <Text style={[styles.label, { color: textColor }]}>
              Confirm Password
            </Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Re-enter your password"
              secureTextEntry={true}
              placeholderTextColor={textColor}
              value={psw.confirm}
              onChangeText={(val => setPsw({...psw, confirm: val}))}
            />
          </View>
        </View>
      )}

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
          By tapping "Next", you agree to our{" "}
          <Link href="/" style={styles.linkText}>
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/" style={styles.linkText}>
            Privacy Policy
          </Link>
          .
        </Text>

        <Pressable style={styles.nextButton} onPress={nextStep}>
          <Text>Next</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default React.memo(SignUp);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 30,
  },
  formContainer: {
    flex: 1,
    marginTop: 25,
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
