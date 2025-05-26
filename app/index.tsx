import { Text, View } from "react-native";
import { Redirect, useRouter} from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import LoaderScreen from "@/components/LoaderScreen";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const token = await AsyncStorage.getItem("token");
      if (!token) {
        router.replace("/auth");
      } else {
        // router.replace('/plan/tradingPlan');
        router.replace('/dashboard');
      }
    };
    checkUser();
  }, []);

  return (
    <View className="flex-1 justify-center items-center dark:bg-bgDark bg-bgLight">
      <LoaderScreen />
    </View>
  );
}
