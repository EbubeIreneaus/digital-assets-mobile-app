import PinModalComponent from "@/components/PinModalComponent";
import { getToken } from "@/lib/authToken";
import { MaterialIcons } from "@expo/vector-icons";
import React, { useState } from "react";
import { View, Text, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SecureStore from "expo-secure-store";
import Toast from "react-native-simple-toast";
import { router } from "expo-router";

async function clearAllCredentials() {
  try {
    await AsyncStorage.clear();
    await SecureStore.deleteItemAsync("pin");
  } catch (error) {}
}

const DeleteAccount = () => {
  const [authenticate, setAuthenticate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  async function DeleteAccount() {
    setIsLoading(true);
    setAuthenticate(false);
    try {
      const token = await getToken();
      const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/auth/`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const res = await req.json();

      if (res.success) {
        await clearAllCredentials();
        Toast.show("Account Deleted successfully", Toast.LONG);
        return router.replace("/auth");
      }
      Toast.show("Could not delete account, contact support", Toast.LONG);
    } catch (error) {
        Toast.show("Could not delete account, contact support", Toast.LONG);
    } finally {
        setIsLoading(false)
    }
  }
  return (
    <View className="flex-1 justify-center px-5 dark:bg-bgDark bg-bgLight">
      {authenticate && (
        <PinModalComponent
          isVisible={authenticate}
          onClose={() => setAuthenticate(false)}
          onValidate={() => DeleteAccount()}
        />
      )}
      <View className="py-10 dark:bg-dark bg-light rounded-lg shadow-md shadow-slate-500">
        <Text className="dark:text-light text-4xl font-extrabold text-center mb-4">
          Are You Sure?
        </Text>
        <Text className="dark:text-light  font-extrabold text-center mb-10">
          This request is irreversable & all data will be lost
        </Text>
        <View className="flex-row justify-between items-center gap-4 px-5 py-5">
          <TouchableOpacity onPress={() => router.back()} className="flex-1 dark:bg-bgDark bg-bgLight py-5 rounded-lg">
            <Text className="text-center text-lg dark:text-light">Cancel</Text>
          </TouchableOpacity>
          <TouchableOpacity
            className="flex-1 flex-row items-center justify-center gap-x-5 bg-red-500 py-5 rounded-md"
            onPress={() => setAuthenticate(true)}
          >
            <MaterialIcons name="delete-forever" color="white" size={20} />
            <Text className="text-light font-bold text-lg">Delete</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default DeleteAccount;
