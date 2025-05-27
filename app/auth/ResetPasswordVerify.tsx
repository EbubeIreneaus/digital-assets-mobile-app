import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import { getJwtUser } from "@/lib/JWTUser";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import Toast from "react-native-simple-toast";
import {
  KeyboardAvoidingView,
  TouchableWithoutFeedback,
  View,
  Text,
  Pressable,
  Image,
  ScrollView,
} from "react-native";
import { OtpInput } from "react-native-otp-entry";


const ResetPasswordVerify = () => {
  const { email }: { email: string } = useLocalSearchParams();
  const [timeCount, setTimeCount] = useState(0);
  const [otp, setOTP] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { textColor } = useAppTheme();
  const inputComponent = useRef<any>(null);

  function waitTime() {
    let t = 60;
    setTimeCount(t);
    const interval = setInterval(() => {
      t--;
      if (t >= 0) {
        setTimeCount(t);
      } else {
        clearInterval(interval);
        return;
      }
    }, 1000);
  }

  async function sendOtp() {
    try {
      const token = await getToken();
      waitTime();
      await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/sendOtpWithoutAuth/${email}`
      );
    } catch (error) {
      Toast.show("server error", Toast.LONG);
    }
  }

  async function submitOtpCode(otpCode: string) {
    try {
      const token = await getToken();
      setOTP(otpCode);
      setIsLoading(true);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/verify-otp-no-auth/${otpCode}?email=${email}`
      );

      const res = await req.json();

      if (res.success) {
        AsyncStorage.setItem("token", res.token);
        return router.replace("/ResetPassword");
      }
      Toast.show(res.msg, Toast.LONG);
    } catch (error) {
      console.log("error submiting verification code", error);
      Toast.show("unknown server error", Toast.LONG);
    } finally {
      inputComponent.current?.clear();
      setIsLoading(false);
    }
  }

  useEffect(() => {
    sendOtp();
  }, []);

  return (
    <ScrollView className="dark:bg-bgDark bg-bgLight flex-1 px-5 ">
      <TouchableWithoutFeedback>
        <View className="flex-1 justify-center py-10">
          <View className="mb-10">
            <Image
              source={require("@/assets/images/auth-security.png")}
              className="size-[150px] mx-auto"
            />
          </View>
          <View className="mb-10">
            <Text className="font-extrabold text-3xl dark:text-light text-center mb-3">
              OTP Code Verification
            </Text>
            <Text className=" text-xl dark:text-light text-center">
              We have sent an OTP code to your email address Enter OTP Code
              below to verify
            </Text>
          </View>
          <View className="mb-5">
            <OtpInput
              ref={inputComponent}
              secureTextEntry={true}
              disabled={isLoading}
              onFilled={(val) => {
                submitOtpCode(val);
              }}
              theme={{
                pinCodeTextStyle: {
                  color: textColor,
                },
              }}
            />
          </View>
          <View>
            <Text className="text-center dark:text-light text-xl mb-3">
              Didn't recieve OTP code?
            </Text>
            <Pressable onPress={() => sendOtp()} disabled={timeCount >= 1}>
              <Text className="text-xl  text-center text-primary">
                {" "}
                {timeCount < 1
                  ? "Resend code"
                  : timeCount >= 60
                  ? "1:00"
                  : timeCount}{" "}
              </Text>
            </Pressable>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </ScrollView>
  );
};

export default ResetPasswordVerify;
