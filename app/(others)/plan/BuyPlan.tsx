import AmountSection from "@/components/AmountSection";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useEffect, useLayoutEffect, useState } from "react";
import Toast from 'react-native-simple-toast'
import {
  Image,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import PinModalComponent from "@/components/PinModalComponent";

const screenHeight = Dimensions.get("window").height;

const BuyPlan = () => {
  const Navigation = useNavigation();
  const { plan, planLabel, planIcon, planRoi, balance } =
    useLocalSearchParams();
  const [amount, setAmount] = useState("0");
  const [authenticate, setAuthenticate] = useState(false)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<any>(null);

  async function purchase() {
    try {
      const token = await getToken();
      if (!token) {
        router.replace("/auth/sign-in");
      }
      setIsLoading(true);
      setAuthenticate(false)
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

      if (res.success) {
        Toast.show("successful", Toast.LONG);
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
    }finally {
      setIsLoading(false)
      
    }
  }

  function ValidateAndAuthenticate(){
    if (Number(amount) > Number(balance)) {
      return setError('Insufficient wallet balance')
    }

    setAuthenticate(true)
  }

  useLayoutEffect(() => {
    Navigation.setOptions({
      title: `Buy ${planLabel} Shares`,
    });
  }, [Navigation, planLabel]);

  return (
    <ScrollView className="flex-1  dark:bg-bgDark bg-bgLight">
      {authenticate && <PinModalComponent isVisible={authenticate} onClose={() => setAuthenticate(false)} onValidate={() => purchase()} />}
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
            <Text className="text-lg font-bold dark:text-light/50 text-dark/50">
              {planRoi}% Today
            </Text>
          </View>

          <View className="">
           <AmountSection inputValue={amount} onButtonClick={(p) => setAmount(p)} onTextChange={(val) => setAmount(val)} />
          </View>

          <View className="my-10">
            <View className="flex-row justify-between items-center dark:bg-slate-900 bg-slate-300 rounded-xl px-4 py-5">
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
                {(Number(amount) <= Number(balance)) &&<MaterialIcons name="check-circle" size={20} className="!text-green-500"/>}
                {(Number(amount) > Number(balance)) &&<MaterialIcons name="cancel" size={20} className="!text-red-500"/>}
              </View>
            </View>
          </View>

          <SubmitButtonWrapper
            label="Buy Plan"
            onSubmit={() => ValidateAndAuthenticate()}
            isLoading={isLoading}
            errorMessage={error}
          />
          
        </View>
      </View>
    </ScrollView>
  );
};

export default BuyPlan;
