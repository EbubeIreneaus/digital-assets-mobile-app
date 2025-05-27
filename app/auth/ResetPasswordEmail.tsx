import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import useAppTheme from "@/lib/appTheme";
import { router } from "expo-router";
import React, { useState } from "react";
import { View, Text, TextInput } from "react-native";

const ResetPasswordEmail = () => {
  const { textColor } = useAppTheme();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [email, setEmail] = useState("");

  const submit = async () => {
    setIsLoading(true);
    setError(null);
    try {
      if (!email || email == "" || email.indexOf("@") < 0) {
        setError("please enter a valid email address");
      }
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/email-already-exist/${email}`
      );
      const res = await req.json();
      if (res.exist) {
        return router.push(`/auth/ResetPasswordVerify?email=${email}`);
      }
      setError("user not found");
    } catch (error) {
      setError("unexpected error occured, contact support");
    }finally{
        setIsLoading(false)
    }
  };

  return (
    <View className="flex-1 dark:bg-bgDark bg-bgLight px-5 py-14">
      <Text className="mb-2 dark:text-light">Email Address</Text>
      <TextInput
        placeholderTextColor={textColor}
        inputMode="email"
        placeholder="email"
        className="py-5 px-2 dark:bg-dark bg-light dark:text-light rounded-lg"
        value={email}
        onChangeText={setEmail}
      />
      <SubmitButtonWrapper
        label="Proceed"
        isLoading={isLoading}
        errorMessage={error}
        onSubmit={submit}
      />
    </View>
  );
};

export default ResetPasswordEmail;
