import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { Picker } from "@react-native-picker/picker";
import { router } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ToastAndroid,
  View,
  Text,
  ScrollView,
  TextInput,
  TouchableOpacity,
} from "react-native";
import Colors from "@/lib/color";
import { FontAwesome } from "@expo/vector-icons";

const Convert = () => {
  const { textColor } = useAppTheme();
  const [cryptos, setCryptos] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    source: "balance",
    destination: "btc",
    amount: "0",
  });

  async function fetchData() {
    const token = await getToken();
    if (!token) {
      return router.push("/auth/sign-in");
    }

    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/crypto/`,
        {
          headers: {
            "profile-id": token.profileId,
          },
        }
      );

      const res = await req.json();
      if (res.status == "failed") {
        return ToastAndroid.show(
          "Unkown server error, try again",
          ToastAndroid.LONG
        );
      }
      delete res.profile;
      
      setCryptos(res);
    } catch (error) {
      return ToastAndroid.show(
        "Unkown server error, try again",
        ToastAndroid.LONG
      );
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  async function save() {
    try {
      setIsLoading(true);
      const token = await getToken();
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/swap/`,
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            "profile-id": token.profileId,
          },
        }
      );
      const res = await req.json();

      if (res.status == "success") {
        fetchData()
        return alert("Saved sucessfully!");
      }
      setError(res.code);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <View className="flex-1 dark:bg-bgDark bg-bgLight ">
      <View className="bg-primary p-5">
        <Text className="text-xl font-extrabold text-slate-300">Swap Coin</Text>
      </View>
      <ScrollView className="px-5 py-10">
        <View className="flex flex-row flex-wrap gap-5 mb-10">
          {Object.keys(cryptos).map((coin: any) => (
            <View key={coin} className="flex-row gap-x-2 border border-primary rounded-xl p-4 bg-light dark:bg-dark">
              <Text className="text-lg font-semibold uppercase dark:text-light">
                {cryptos[coin]}
              </Text>
              <Text className="text-lg font-semibold uppercase dark:text-light">
                {coin}
              </Text>
            </View>
          ))}
        </View>

        <View className="py-10">
          <View className="mb-7">
            <Text className="dark:text-light text-lg mb-2">Source Account</Text>
            <View className="bg-light dark:bg-dark rounded-md">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.source}
                onValueChange={(val: string, index) =>
                  setForm({ ...form, source: val })
                }
              >
                {Object.keys(cryptos).map((coin) => (
                  <Picker.Item label={coin.toUpperCase()} value={coin} key={coin} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-7">
            <Text className="dark:text-light text-lg mb-2">
              Destination Account
            </Text>
            <View className="bg-light dark:bg-dark rounded-md">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.destination}
                onValueChange={(val: string, index) =>
                  setForm({ ...form, destination: val })
                }
              >
                {Object.keys(cryptos).map((coin) => (
                  <Picker.Item label={coin.toUpperCase()} value={coin} key={coin} />
                ))}
              </Picker>
            </View>
          </View>

          <View className="mb-10">
            <Text className="dark:text-light text-lg mb-2 ">Amount</Text>
            <View>
              <TextInput
                inputMode="decimal"
                className="dark:bg-dark dark:text-light h-14 rounded-xl px-3"
                value={form.amount}
                onChangeText={(val) => setForm({ ...form, amount: val })}
              />
            </View>
          </View>

          <View className="mb-10">
            <Text className="dark:text-light text-lg mb-2 ">
              You will Recieve
            </Text>
            <View className="dark:bg-dark bg-light  h-14 rounded-xl justify-center px-5">
              <Text className="dark:text-light font-semibold text-lg">
                {form.destination.toUpperCase()}
              </Text>
            </View>
          </View>

          <View>
            <Text className="text-xl font-semibold dark:text-light mb-5">
              Fee = 40%
            </Text>

            <Text className=" font-semibold text-red-500 mb-3 text-center">
              {error}
            </Text>

            <TouchableOpacity onPress={() => save()} className="py-4 rounded-lg px-10 bg-primary flex-row justify-center items-center gap-x-3">
              {isLoading && <FontAwesome name="spinner" size={24} className="animate-spin" color='white' />}
              <Text className="text-center text-light">save</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default Convert;
