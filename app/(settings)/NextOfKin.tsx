import PinModalComponent from "@/components/PinModalComponent";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, TouchableOpacity } from "react-native";
import { View, Text } from "react-native";
import Toast from "react-native-simple-toast";

const screenHeight = Dimensions.get("window").height;

const NextOfKin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [data, setData] = useState<any>(null);
  const { textColor } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [authenticate, setAuthenticate] = useState(false);

  useEffect(() => {
    async function fetchData() {
      try {
        setIsLoading(true);
        const token = await getToken();
        const req = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/auth/next-of-kin`,
          {
            headers: {
              Authorization: `Bearer ${token || null}`,
            },
          }
        );
        const res = await req.json();

        if (res.success) {
          return setData(res.data);
        }
        Toast.show(res.msg, Toast.LONG);
      } catch (error) {
        Toast.show("Error fetching data", Toast.LONG);
      } finally {
        setIsLoading(false);
      }
    }
    fetchData();
  }, []);

  async function deleteNextOfKin() {
    setIsDeleting(true);
    setError(null);
    setAuthenticate(false);
    const token = await getToken();
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/next-of-kin`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token || null}`,
          },
        }
      );
      const data = await res.json();
      if (data.success) {
        Toast.show("Next of kin deleted successfully", Toast.LONG);
        return setData(null as any)
      }
      return setError(data.msg);
    } catch (error) {
      setError("An error occurred while deleting next of kin");
    } finally {
      setIsDeleting(false);
    }
  }

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight p-5">
      {!data && (
        <View style={{minHeight: screenHeight-50}} className='flex-1 justify-center items-center'>
          <Text className='dark:text-light text-2xl font-semibold mb-3'>No Registered Next of Kin</Text>
          <Link href="/AddNextOfKin" asChild>
            <TouchableOpacity className='p-3'>
              <Text className='dark:text-light/50 text-dark/50 font-semibold text-center text-lg'>Click to Add</Text>
            </TouchableOpacity>
          </Link>
        </View>
      )}
      {data && (
        <View style={{minHeight: screenHeight-50}} className="flex-1 justify-center  dark:bg-dark bg-light px-5 rounded-xl">
        <View className="flex-row justify-between items-center mb-5">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Fullname
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl">
            {data?.fullname}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Email
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl">
            {data?.email}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Relationship
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl">
            {data?.relationship}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Country of Residence
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl">
            {data?.country}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-5">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Phone
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl">
            {data?.phone}
          </Text>
        </View>
        <View className="flex-row justify-between items-center mb-5 gap-x-3">
          <Text className="dark:text-light/50 text-dark/50 text-lg font-semibold mb-3">
            Address
          </Text>
          <Text className="dark:text-light text-dark font-semibold text-center text-xl line-clamp-1">
            {data?.address}
          </Text>
        </View>

        <View className="mt-10">
          <View className="bg-amber-500/50 rounded-lg p-4">
            <MaterialIcons name="info" size={24} color={textColor} />
            <Text className="text-sm text-dark dark:text-light capitalize">
              if for for six months you have been inactive on your account and
              failed to respond to messages from the company your next of kin is
              to be contacted as to your way about and if dead and with proper
              death certificate and evidence all assets would be immediately
              transferred to your next of kin
            </Text>
          </View>
        </View>

        <View className="mt-8">
          <Text className="mb-3 text-red-500 text-center capitalize font-semibold">
            {error}{" "}
          </Text>
          <TouchableOpacity
            disabled={isDeleting}
            onPress={() =>  setAuthenticate(!authenticate)}
            className="bg-red-500 flex-row justify-center items-center gap-x-5 py-4 rounded-xl"
          >
            {isDeleting && (
              <FontAwesome
                name="spinner"
                size={20}
                color="white"
                className="animate-spin"
              />
            )}
            <Text className="text-light text-lg font-semibold">
              Delete Next of Kin
            </Text>
          </TouchableOpacity>
        </View>
      </View>)}

      {authenticate && (
        <PinModalComponent
          isVisible={authenticate}
          onClose={() => setAuthenticate(false)}
          onValidate={() => deleteNextOfKin()}
        />
      )}
    </ScrollView>
  );
};

export default NextOfKin;
