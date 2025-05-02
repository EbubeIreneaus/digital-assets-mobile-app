import React, { useEffect, useState } from "react";
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
import { Link, router } from "expo-router";
import { COUNTRIES } from "@/lib/countryList";
import z, { Schema } from "zod";
import {FontAwesome5} from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

const InfoSchema = z.object({
  first_name: z.string().min(1, { message: "firstname is required" }),
  last_name: z.string().min(1, { message: "lastname is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  country: z.string().min(1, { message: "Country is required" }),
  phone: z.string().min(10, { message: "Phone number is required" }),
});

const PasswordSchema = z
  .object({
    username: z.coerce.string().min(1, { message: "Username is required" }),
    password: z.coerce
      .string()
      .min(6, { message: "Password must be 6 characters long" }),
    confirm: z.coerce
      .string()
      .min(6, { message: "Confirm password is required" }),
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
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);


  const [accountType, setAccountType] = useState("personal");

  const [infoData, setInfoData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "Afghanistan",
    phone: "",
    code: '+93'
  });

  useEffect(() => {
    const code = infoData.code
    const country = COUNTRIES.find(ct => ct.name == infoData.country)
    if (country?.mobileCode) {
      setInfoData({...infoData, code: country.mobileCode})
    }
  }, [infoData.country])


  const [psw, setPsw] = useState({
    username: "",
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
          submit();
        }
        break;
    }
  }

  

  async function submit() {
    setIsLoading(true);
    setError(null);
    let body = { type: accountType, ...infoData, ...psw };
    try {
      const res = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
      });
      
      const data = await res.json();

      if(data.status === "success"){
        delete data.status
        AsyncStorage.setItem("user", JSON.stringify(data))
        return router.push("/")
      }

      if (data.status === 'failed') {
        if (data.code === 'invalid_data') {
          const errors = data.errors
          const error_keys = Object.keys(errors) 
          setError(errors[error_keys[0]][0])
          return
        }

        return setError(data.code)
      }

    } catch (error: any) {
      setError("An error occurred. Please try again.");
    } finally {
      setIsLoading(false);
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
     <View style={{flexDirection: 'row', alignItems: 'center', gap: 20}}>
      {step > 1 && <Pressable onPress={() => setStep(step -1)}>
        <FontAwesome5 name="arrow-left" size={24} color={textColor} />
      </Pressable>}
     <Text style={{ fontSize: 24, fontWeight: "bold", color: textColor }}>
        Sign up
      </Text>

     </View>
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
        <ScrollView style={[styles.formContainer, { height: 200, marginBottom: 30 }]}>
          <View>
            <Text style={[styles.label, { color: textColor }]}>Firstname</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your firstname"
              placeholderTextColor={textColor}
              value={infoData.first_name}
              onChangeText={(val) => handleInfoData(val, "first_name")}
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
              value={infoData.last_name}
              onChangeText={(val) => handleInfoData(val, "last_name")}
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
        <ScrollView style={[styles.formContainer, {marginBottom: 30}]}>
          <View>
            <Text style={[styles.label, { color: textColor }]}>Username</Text>
            <TextInput
              style={[
                styles.input,
                { backgroundColor: bgColor, color: textColor },
              ]}
              placeholder="Enter your username"
              placeholderTextColor={textColor}
              value={psw.username}
              onChangeText={(val) => setPsw({ ...psw, username: val })}
            />
          </View>

          <View style={{ marginVertical: 14 }}>
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
              onChangeText={(val) => setPsw({ ...psw, password: val })}
            />
          </View>

          <View>
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
              onChangeText={(val) => setPsw({ ...psw, confirm: val })}
            />
          </View>
        </ScrollView>
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
        {error ? (
          <Text
            style={[
              styles.nextText,
              {
                color: "red",
                backgroundColor:
                  colorScheme == "dark" ? Colors.bgDark : Colors.bgLight,
              },
            ]}
          >
            {error}.
          </Text>
        ) : (
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
            <Link href="/">
              <Text style={styles.linkText}>Terms of Service</Text>
            </Link>{" "}
            and{" "}
            <Link href="/">
              <Text style={styles.linkText}>Privacy Policy</Text>
            </Link>
            .
          </Text>
        )}

        <Pressable style={styles.nextButton} onPress={nextStep}>
          <Text style={{ color: textColor }}>Next</Text>
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
