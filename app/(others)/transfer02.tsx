import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Image,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  ToastAndroid,
} from "react-native";

const Transfer002 = () => {
  const { textColor } = useAppTheme();
  const { fullname, email, available_balance, balance } =
    useLocalSearchParams();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<'balance' | 'available_balance'| ''>("");

  async function submit() {
    const token = await getToken();
    if (!token) {
      return router.push("/auth/sign-in");
    }

    try {
      setIsLoading(true);
      setError(null);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/transfer`,
        {
          method: "POST",
          body: JSON.stringify({ 'to': email, amount: Number(amount), source }),
          headers: {
            Authorization: `Bearer ${token}`,  
          },
        }
      );

      const res = await req.json();

      if (res.success) {
        ToastAndroid.show("Transfer successful", ToastAndroid.LONG);
        return router.push("/transfer");
      }
      setError(res.msg);
    } catch (error) {
      setError("unknown error, try again");
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (source == "" && Number(amount) <= Number(available_balance)) {
      setSource("available_balance");
    } else if (
      source == "" &&
      Number(amount) > Number(available_balance) &&
      Number(amount) <= Number(balance)
    ) {
      setSource("balance");
    } else {
      setSource("");
    }
  }, [amount]);

  return (
    <View className="flex-1 dark:bg-bgDark bg-bgLight">
      <View className="flex-1 dark:bg-dark bg-light mx-3 p-4 rounded-lg justify-center items-center">
        <View>
          <View className="items-center mb-10">
            <Image
              source={require("@/assets/images/user-placeholder.png")}
              className="rounded-full mb-2"
              style={{ width: 100, height: 100 }}
            />
            <Text className="dark:text-slate-300 text-slate-900 text-xl font-semibold">
              {fullname}
            </Text>
          </View>

          <View className="">
            <View>
              <TextInput
                inputMode="numeric"
                placeholder="0.00"
                value={amount}
                onChangeText={(val) => setAmount(val)}
                placeholderTextColor={textColor}
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
          <Text className="text-light">{source}</Text>
          <View className="my-10">
            <TouchableOpacity
              disabled={Number(amount) > Number(available_balance)}
              onPress={() => {
                setSource("available_balance");
              }}
              className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5 mb-5"
            >
              <View className="flex-row items-center gap-x-5">
                <MaterialIcons
                  name="wallet"
                  size={24}
                  className="dark:!text-light"
                />
                <Text className="dark:text-light text-lg font-semibold">
                  Available Earnings
                </Text>
              </View>
              <View className="flex-row items-center gap-x-3">
                <Text className="dark:text-light text-lg font-semibold">
                  {Currency(Number(available_balance))}
                </Text>
                <MaterialIcons
                  name={
                    source == "available_balance" ? "check-circle" : "cancel"
                  }
                  size={15}
                  className={
                    source == "available_balance" ? "!text-green-600" : ""
                  }
                />
              </View>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => setSource("balance")}
              disabled={Number(amount) > Number(balance)}
              className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5"
            >
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
                  name={source == "balance" ? "check-circle" : "cancel"}
                  size={15}
                  className={source == "balance" ? "!text-green-600" : ""}
                />
              </View>
            </TouchableOpacity>
          </View>

          <View className="mt-10">
            <Text className="mb-3 text-red-500 text-center capitalize font-semibold">
              {error ? error : ""}{" "}
            </Text>
            <TouchableOpacity
              onPress={() => submit()}
              className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl"
            >
              {isLoading && (
                <FontAwesome
                  name="spinner"
                  size={20}
                  color="white"
                  className="!animat-spin"
                />
              )}
              <Text className="text-light text-lg font-semibold">
                Sell Plan
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

export default Transfer002;
