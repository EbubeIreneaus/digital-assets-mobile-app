import { Text, View } from "react-native";
import { Redirect, useRouter} from "expo-router";
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function Index() {
  const router = useRouter();

  useEffect(() => {
    const checkUser = async () => {
      const user = await AsyncStorage.getItem("user");
      if (!user) {
        router.replace("/auth");
      } else {
        // router.replace('/plan/tradingPlan');
        router.replace('/setting');
      }
    };
    checkUser();
  }, []);

  return (
    <View>
      <Text>Loading...</Text>
    </View>
  );
}
