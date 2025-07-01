import AmountSection from "@/components/AmountSection";
import PinModalComponent from "@/components/PinModalComponent";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from "react-native";
import Toast from "react-native-simple-toast";

const screenHeight = Dimensions.get("window").height - 70;

const SellPlan = () => {
  const Navigation = useNavigation();
  const { planBalance, plan, planLabel } = useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<null | string>(null);
  const [authenticate, setAuthenticate] = useState(false);
  const [form, setForm] = useState({
    amount: "0",
    to: "balance",
  });

  async function submit() {
    try {
      setIsLoading(true);
      setAuthenticate(false);
      setError(null);
      const token = await getToken();
      if (!token) {
        return router.replace("/auth/sign-in");
      }

      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/sell-plan`,
        {
          method: "POST",
          body: JSON.stringify({
            ...form,
            amount: Number(form.amount),
            plan: String(plan),
          }),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await req.json();

      if (res.success) {
        Toast.show("successfull", Toast.LONG);
        return router.replace(`/plan/myPlan?p=${plan}`);
      }
      setError(res.msg);
    } catch (error) {
      console.log(error);
      setError("unknown server error, try again");
    } finally {
      setIsLoading(false);
    }
  }

  useLayoutEffect(() => {
    Navigation.setOptions({
      title: `Sell ${planLabel} Shares`,
    });
  }, [Navigation, planLabel]);

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight">
      {authenticate && <PinModalComponent
        isVisible={authenticate}
        onClose={() => setAuthenticate(false)}
        onValidate={() => submit()}
      />}
      <View
        className="flex-1 justify-center"
        style={{ minHeight: screenHeight }}
      >
        <View className="dark:bg-dark bg-light mx-3 p-5 rounded-xl">
          <View className="flex-row items-center justify-evenly py-10">
            <MaterialIcons
              name="wallet"
              size={40}
              className="!text-blue-500"
              color="purple"
            />
            <View>
              <Text className="text-3xl font-bold dark:text-light mb-2">
                {Currency(Number(planBalance))}
              </Text>
              <Text className=" font-bold text-primary capitalize">
                {planLabel} Balance
              </Text>
            </View>
          </View>

          <AmountSection
            inputValue={form.amount}
            onButtonClick={(p) => setForm({ ...form, amount: p })}
            onTextChange={(val) => setForm({ ...form, amount: val })}
          />

          <View className="my-5">
            <Text className="text-primary text-xl font-semibold mb-3">
              Sell to:
            </Text>
            <View className="mb-4">
              <TouchableOpacity
                onPress={() => setForm({ ...form, to: "balance" })}
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

                <MaterialIcons
                  name="check-circle"
                  size={15}
                  color={form.to == "balance" ? "green" : ""}
                />
              </TouchableOpacity>
            </View>

            <View className="">
              <TouchableOpacity
                onPress={() => setForm({ ...form, to: "available_balance" })}
                className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5"
              >
                <View className="flex-row items-center gap-x-5">
                  <MaterialIcons
                    name="wallet-giftcard"
                    size={24}
                    className="dark:!text-light"
                  />
                  <Text className="dark:text-light text-lg font-semibold">
                    Available Earnings
                  </Text>
                </View>

                <MaterialIcons
                  name="check-circle"
                  size={15}
                  color={form.to == "available_balance" ? "green" : ""}
                />
              </TouchableOpacity>
            </View>
          </View>

          <SubmitButtonWrapper
            onSubmit={() => submit()}
            label="Sell Plan"
            isLoading={isLoading}
            errorMessage={error}
          />
        </View>
      </View>
    </ScrollView>
  );
};

export default SellPlan;
