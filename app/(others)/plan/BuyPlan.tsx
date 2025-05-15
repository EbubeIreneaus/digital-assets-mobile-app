import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import {
  Image,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
  ToastAndroid,
} from "react-native";

const screenHeight = Dimensions.get("window").height;

const BuyPlan = () => {
  const Navigation = useNavigation();
  const { plan, planLabel, planIcon, planRoi, balance } =
    useLocalSearchParams();
  const [amount, setAmount] = useState("0");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  async function purchase() {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/auth/sign-in");
      }
      setIsLoading(true);
      setError(null);

      if (isNaN(Number(amount)) || Number(amount) < 1) {
        return setError("amount should be only numbers");
      }
      if (Number(amount) > Number(balance)) {
        return setError("Insufficient Account Balance");
      }
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/buy-plan`,
        {
          method: "POST",
          body: JSON.stringify({ planName: plan, amount: Number(amount) }),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await req.json();
      console.log("res", res);
      if (res.success) {
        ToastAndroid.show("successful", ToastAndroid.LONG);
        const timeout = setTimeout(() => {
          router.replace(`/plan/myPlan?p=${plan}`);
          clearTimeout(timeout);
        }, 1000);
        return true;
      }
      setError(res.msg);
    } catch (error) {
      console.log(error);
      setError("unknown server error");
    }
  }

  useLayoutEffect(() => {
    Navigation.setOptions({
      title: `Buy ${planLabel} Shares`,
    });
  }, [Navigation, planLabel]);

  return (
    <ScrollView className="flex-1  dark:bg-bgDark bg-bgLight">
      <View
        className="flex-1 justify-center"
        style={{ minHeight: screenHeight }}
      >
        <View className="dark:bg-dark bg-light rounded-xl flex-1 mx-3 p-5">
          <View className="py-12 justify-center items-center">
            <View className="border-4 dark:border-slate-950 border-slate-50 p-3 rounded-full mb-3">
              <Image
                source={{
                  uri: `${process.env.EXPO_PUBLIC_API_URL}/${planIcon}`,
                }}
                className="!size-20 "
              />
            </View>
            <Text className="text-3xl font-bold dark:text-light italic">
              {planLabel} Plan
            </Text>
            <Text className="text-lg font-bold text-primary">
              {planRoi}% Daily
            </Text>
          </View>

          <View className="">
            <View>
              <TextInput
                inputMode="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={(val) => setAmount(val)}
                placeholderClassName="dark:!text-light"
                className="py-4 px-3 dark:bg-slate-950/50 bg-slate-200 dark:text-light rounded-lg"
              />
            </View>
            <View className="flex-row gap-4 flex-wrap py-5">
              {[100, 200, 500, 1000, 2000, 5000, 10000].map((p) => (
                <TouchableOpacity
                  key={p}
                  className="py-4 px-6 dark:bg-slate-950/50 bg-slate-300 rounded-xl"
                  onPress={() => setAmount(p.toString())}
                >
                  <Text className="dark:text-slate-100">{Currency(p)}</Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          <View className="my-10">
            <View className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5">
              <View className="flex-row items-center gap-x-5">
                <MaterialIcons
                  name="wallet"
                  size={24}
                  className="dark:!text-light"
                />
                <Text className="dark:text-light text-lg font-semibold">
                  Balance
                </Text>
              </View>
              <View className="flex-row items-center gap-x-3">
                <Text className="dark:text-light text-lg font-semibold">
                  {Currency(Number(balance))}
                </Text>
                <MaterialIcons
                  name={
                    Number(balance) > Number(amount) ? "check-circle" : "cancel"
                  }
                  size={15}
                  className={
                    Number(balance) > Number(amount)
                      ? "!text-green-600"
                      : "!text-red-600"
                  }
                />
              </View>
            </View>
          </View>

          <View className="mt-10">
            <Text className="mb-3 text-red-500 text-center capitalize font-semibold">{error?error:''} </Text>
            <TouchableOpacity onPress={()=> purchase()} className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl">
               { isLoading && <FontAwesome name="spinner" size={20} color='white' className="!animat-spin" />}
              <Text className="text-light text-lg font-semibold">Buy Plan</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ScrollView>
  );
};

export default BuyPlan;
