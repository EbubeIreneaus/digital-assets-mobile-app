import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { getToken } from "@/lib/authToken";
import { Link, router } from "expo-router";
import React, { useState } from "react";
import { TextInput, View, Text } from "react-native";
import Toast from "react-native-simple-toast";
import z from "zod";

const ResetPassword = () => {

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [form, setForm] = useState({
    new: "",
    confirm: "",
  });

  function handleTextChange(key: keyof typeof form, val: string) {
    setError(null);
    return setForm({ ...form, [key]: val });
  }

  function ValidatePasswords() {
    if (form.new.length < 6) {
      setError("password must be six (6) characters or long");
      return false;
    }

    if (form.new !== form.confirm) {
      setError("Confirm password does not match new password");
      return false;
    }

    return true;
  }

  async function submit() {
    if (!ValidatePasswords()) return null;
    setError(null);
    setIsLoading(true);
    try {
      const token = await getToken();
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/reset-password`,
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        Toast.show("password updated successfully", Toast.LONG);
        return router.replace("/setting");
      }
      setError(res.msg);
    } catch (error) {
      console.log("error updating password", error);
      setError("unexpected error occured, try again later");
    } finally {
      setIsLoading(false);
    }
  }
  return (
    <View className="flex-1 dark:bg-slate-900 bg-slate-200  justify-center px-3">
      <View className="py-10 px-5 dark:bg-slate-950 bg-slate-300 rounded-lg">
        <View className="mb-5">
          <Text className="dark:text-light mb-4 text-lg">New Password</Text>
          <TextInput
            className="p-4 rounded-lg dark:bg-slate-800 bg-slate-100 dark:text-light"
            value={form.new}
            secureTextEntry={true}
            onChangeText={(val) => handleTextChange("new", val)}
          />
        </View>

        <View className="mb-5">
          <Text className="dark:text-light mb-4 text-lg">Confirm Password</Text>
          <TextInput
            className="p-4 rounded-lg dark:bg-slate-800 bg-slate-100 dark:text-light"
            value={form.confirm}
            secureTextEntry={true}
            onChangeText={(val) => handleTextChange("confirm", val)}
          />
        </View>

        <View className="mb-5">
          <Link
            href="/VerifyUser?action=password"
            className="text-primary text-lg text-center font-bold"
          >
            Forgot Password?
          </Link>
        </View>

        <SubmitButtonWrapper
          label="Reset Password"
          isLoading={isLoading}
          errorMessage={error}
          onSubmit={() => submit()}
        />
      </View>
    </View>
  );
};

export default ResetPassword;
