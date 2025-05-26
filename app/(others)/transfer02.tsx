import AmountSection from "@/components/AmountSection";
import PinModalComponent from "@/components/PinModalComponent";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
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
  const [authenticate, setAuthenticate] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState("");
  const [source, setSource] = useState<"balance" | "available_balance" | "">(
    ""
  );

  function ValidateAndAuthenticate(){
    if (Number(amount) < 1) {
      return setError('Please enter amount')
    }

    if (source == '' ) {
      return setError('No source selected for transfer')
    }

    setAuthenticate(true)
  }

  async function submit() {
    const token = await getToken();
    if (!token) {
      return router.replace("/auth/sign-in");
    }

    try {
      setIsLoading(true);
      setAuthenticate(false)
      setError(null);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/transfer`,
        {
          method: "POST",
          body: JSON.stringify({ to: email, amount: Number(amount), source }),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await req.json();

      if (res.success) {
        ToastAndroid.show("Transfer successful", ToastAndroid.LONG);
        return router.replace("/transfer");
      }
      setError(res.msg);
    } catch (error) {
      setError("unknown error, try again");
    } finally {
      setIsLoading(false);
    }
  }

  // useEffect(() => {
  //   if (source == "" && Number(amount) <= Number(available_balance)) {
  //     setSource("available_balance");
  //   } else if (
  //     source == "" &&
  //     Number(amount) > Number(available_balance) &&
  //     Number(amount) <= Number(balance)
  //   ) {
  //     setSource("balance");
  //   } else {
  //     setSource("");
  //   }
  // }, [amount]);

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
            <AmountSection
              inputValue={amount}
              onButtonClick={(val) => setAmount(val)}
              onTextChange={(val) => setAmount(val)}
            />
          </View>

          <View className="my-10">
            <TouchableOpacity
              disabled={Number(amount) > Number(available_balance)}
              onPress={() => {
                setSource("available_balance");
              }}
              className="flex-row justify-between items-center dark:bg-slate-800 bg-slate-100 rounded-xl px-4 py-5 mb-5"
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
              className="flex-row justify-between items-center dark:bg-slate-800 bg-slate-100 rounded-xl px-4 py-5"
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
          {authenticate && (
            <PinModalComponent
              isVisible={authenticate}
              onClose={() => setAuthenticate(false)}
              onValidate={() => submit()}
            />
          )}
          <SubmitButtonWrapper
            label="Transfer"
            errorMessage={error}
            isLoading={isLoading}
            onSubmit={() => ValidateAndAuthenticate()}
          />
        </View>
      </View>
    </View>
  );
};

export default Transfer002;
