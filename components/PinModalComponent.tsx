import React, { useEffect, useRef, useState } from "react";
import { View, Text, TouchableOpacity, Modal } from "react-native";
import CustomModal from "./Modal";
import { OtpInput } from "react-native-otp-entry";
import useAppTheme from "@/lib/appTheme";
import { Link, router } from "expo-router";
import * as SecureStore from 'expo-secure-store'
import { SafeAreaView, SafeAreaProvider } from "react-native-safe-area-context";

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

type props = {
  onValidate: () => void,
  onClose: () => void,
  isVisible: boolean
}

const PinModalComponent = ({onValidate, onClose, isVisible}: props) => {
  const { primaryColor, textColor } = useAppTheme();
  const [otp, setOtp] = useState("");
  const [error, setError] = useState<null | string>(null)
  const OtpInputRef = useRef<React.ComponentRef<typeof OtpInput>>(null);

  useEffect(() => {
    async function checkIfUserHaveSetPin(){
      const savedPin = await SecureStore.getItemAsync('pin')
      if (!savedPin) {
        return router.push('/SetPin')
      }
    }
    checkIfUserHaveSetPin()
  }, [])

  useEffect(() => {
    OtpInputRef.current?.setValue(otp);
  }, [otp]);

  function KeyPress(key: string) {
    setError(null)
    if (key === "del") {
      let code = otp.slice(0, otp.length - 1);
      return setOtp(code);
    }

    if (otp.length >= 4) {
        return false
    }

    setOtp(otp + key);
  }

  async function ValidateAndSubmit(){
    const savedPin = await SecureStore.getItemAsync('pin')
    if (otp == savedPin) {
      onValidate()
    }else{
      setError('Incorrect pin')
      setOtp('')
      return
    }
  }

  return (
    <SafeAreaProvider>
          <SafeAreaView>
            <Modal animationType="slide" visible={isVisible} transparent={true} onRequestClose={() => onClose()}>
                <View className="flex-1 justify-end">
        <View className="dark:bg-dark bg-light py-10">
          <View className="mb-5">
            <OtpInput
              numberOfDigits={4}
              autoFocus={true}
              secureTextEntry={true}
              ref={OtpInputRef}
              textInputProps={{ editable: false }}
              blurOnFilled={true}
              onFilled={() => ValidateAndSubmit()}
              theme={{
                containerStyle: { justifyContent: "center", gap: 20 },
                pinCodeContainerStyle: {
                  borderRadius: 1,
                  borderColor: error ? 'red' : primaryColor,
                },
                pinCodeTextStyle: { color: textColor },
                focusedPinCodeContainerStyle: {borderColor:  error ? 'red' : primaryColor}
              }}
            />
          </View>

          <View className="mb-5">
            <Link href="/VerifyUser?action=pin" className="text-center text-xl font-bold text-primary">
              Forgot Pin
            </Link>
          </View>

          <View className="flex-row flex-wrap">
            {KeyboardKey.map((key) => (
              <TouchableOpacity
                onPress={() => KeyPress(key)}
                className="w-[33%]"
                key={key}
              >
                <Text className="text-center text-xl font-extrabold py-8 dark:text-slate-200">
                  {key}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
            </Modal>
          </SafeAreaView>
        </SafeAreaProvider>
  );
};

export default PinModalComponent;
