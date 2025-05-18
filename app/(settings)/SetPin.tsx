import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, ToastAndroid } from "react-native";
import { OtpInput } from "react-native-otp-entry";
import useAppTheme from "@/lib/appTheme";
import * as SecureStore from "expo-secure-store";
import { Link, router } from "expo-router";

const KeyboardKey = [
  "1",
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "",
  "0",
  "del",
];

const ResetPin = () => {
  const { primaryColor, textColor } = useAppTheme();
  const [pos, setPos] = useState(1);
  const [otp1, setOtp1] = useState("");
  const [otp2, setOtp2] = useState("");
  const [otp3, setOtp3] = useState("");
  const [error, setError] = useState<any>({
    otp1: null,
    otp2: null,
    otp3: null,
  });

  const OtpInputRef1 = useRef<React.ComponentRef<typeof OtpInput>>(null);
  const OtpInputRef2 = useRef<React.ComponentRef<typeof OtpInput>>(null);
  const OtpInputRef3 = useRef<React.ComponentRef<typeof OtpInput>>(null);

  useEffect(() => {
    const fetchSavedPin = async () => {
      const savedPin = await SecureStore.getItemAsync("pin");
      if (!savedPin) {
        return setPos(2);
      }
    };
    fetchSavedPin();
  }, []);

  useEffect(() => {
    OtpInputRef1.current?.setValue(otp1);
  }, [otp1]);

  useEffect(() => {
    OtpInputRef2.current?.setValue(otp2);
  }, [otp2]);

  useEffect(() => {
    OtpInputRef3.current?.setValue(otp3);
  }, [otp3]);

  function KeyPress(key: string) {
    setError({otp1: null, otp2: null})
    switch (pos) {
      case 1:
        if (key === "del") {
          setOtp1(otp1.slice(0, otp1.length - 1));
        } else {
          setOtp1(otp1 + key);
        }
        break;
      case 2:
        if (key === "del") {
          setOtp2(otp2.slice(0, otp2.length - 1));
        } else {
          setOtp2(otp2 + key);
        }
        break;
      case 3:
        if (key === "del") {
          setOtp3(otp3.slice(0, otp3.length - 1));
        } else {
          setOtp3(otp3 + key);
        }
        break;

      default:
        break;
    }
  }

  async function ValidatePreviousPin() {
    const savedPin = await SecureStore.getItemAsync("pin");
      if (!savedPin ||otp1 == savedPin) {
        return setPos(2);
      }
      setError({...error, otp1: 'pin mismatch previous pin'})
      setOtp1('')
  }

  async function SETUSERPIN() {
    if (otp2 === otp3) {
      await SecureStore.setItemAsync('pin', otp2)
      ToastAndroid.show('Pin set successfully', ToastAndroid.LONG)
      return router.back();
    }

    setError({ ...error, otp2: "mismatch pin" });
    setOtp2('')
    setOtp3('')
    setPos(2)
  }

  return (
    <View className="flex-1 justify-end dark:bg-slate-900 bg-slate-200">
      <View className="dark:bg-slate-950 bg-slate-300 py-10 rounded-tr-lg rounded-tl-lg">
        {/* otp 1 */}
        {pos === 1 && (
          <>
            <View className="mb-5">
              <OtpInput
                numberOfDigits={4}
                autoFocus={true}
                secureTextEntry={true}
                ref={OtpInputRef1}
                textInputProps={{ editable: false }}
                blurOnFilled={true}
                onFilled={() => ValidatePreviousPin()}
                theme={{
                  containerStyle: { justifyContent: "center", gap: 20 },
                  pinCodeContainerStyle: {
                    borderRadius: 1,
                    borderColor: error.otp1 ? 'red' : primaryColor,
                  },
                  pinCodeTextStyle: { color: textColor },
                  focusedPinCodeContainerStyle:{borderColor: error.otp1 ? 'red' : primaryColor}
                }}
              />
            </View>

            <View className="mb-5">
              <Link href="/VerifyUser?action=pin" className="text-center text-xl font-bold text-primary">
                Forgotten Previous Pin?
              </Link>
            </View>
          </>
        )}

        {/* otp 2 */}
        {pos === 2 && (
          <>
            <View className="mb-5">
              <OtpInput
                numberOfDigits={4}
                autoFocus={true}
                secureTextEntry={true}
                ref={OtpInputRef2}
                textInputProps={{ editable: false }}
                blurOnFilled={true}
                onFilled={() => setPos(3)}
                theme={{
                  containerStyle: { justifyContent: "center", gap: 20 },
                  pinCodeContainerStyle: {
                    borderRadius: 1,
                    borderColor: error.otp2 ? "red" : primaryColor,
                  },
                  pinCodeTextStyle: { color: textColor },
                  focusedPinCodeContainerStyle:{borderColor: error.otp2 ? "red" : primaryColor,}
                }}
              />
            </View>
            <View className="mb-5">
              <Text className="text-center text-xl font-bold text-primary">
                New Pin
              </Text>
            </View>
          </>
        )}

        {/* otp 3 */}

        {pos === 3 && (
          <>
            <View className="mb-5">
              <OtpInput
                numberOfDigits={4}
                autoFocus={true}
                secureTextEntry={true}
                ref={OtpInputRef3}
                textInputProps={{ editable: false }}
                blurOnFilled={true}
                onFilled={() => SETUSERPIN()}
                theme={{
                  containerStyle: { justifyContent: "center", gap: 20 },
                  pinCodeContainerStyle: {
                    borderRadius: 1,
                    borderColor: primaryColor,
                  },
                  pinCodeTextStyle: { color: textColor },
                  focusedPinCodeContainerStyle:{borderColor: primaryColor}
                }}
              />
            </View>
            <View className="mb-5">
              <Text className="text-center text-xl font-bold text-primary">
                Confirm New Pin
              </Text>
            </View>
          </>
        )}

        <View className="flex-row flex-wrap">
          {KeyboardKey.map((key) => (
            <TouchableOpacity
              onPress={() => KeyPress(key)}
              key={key}
              className="w-[33%]"
            >
              <Text className="text-center text-xl font-extrabold py-8 dark:text-slate-200">
                {key}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

export default ResetPin;
