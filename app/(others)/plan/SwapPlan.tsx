import AmountSection from "@/components/AmountSection";
import LoaderScreen from "@/components/LoaderScreen";
import PinModalComponent from "@/components/PinModalComponent";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  TextInput,
  Dimensions,
  ToastAndroid,
  RefreshControl,
} from "react-native";
import { set } from "zod";

const screenHeight = Dimensions.get("window").height;

const SwapPlan = () => {
  const { plan } = useLocalSearchParams();
  const { textColor, bgColor } = useAppTheme();
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [plans, setPlans] = useState([]);
  const [authenticate, setAuthenticate] = useState(false);
  const [refreshing, setRefreshing] = useState(false);

  const [form, setForm] = useState({
    amount: "0",
    source: plan ? String(plan) : "",
    destination: 'stock',
  });

  async function fetch_plans() {
    try {
      setFetching(true);
      const token = await getToken();
      if (!token) {
        return router.replace("/auth/sign-in");
      }

      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/plans`
      );

      const res = await req.json();

      if (res.success) {
        return setPlans(res.plans);
      }
      return ToastAndroid.show("server error", ToastAndroid.SHORT);
    } catch (error) {
      return ToastAndroid.show("server error", ToastAndroid.SHORT);
    } finally {
      setFetching(false);
    }
  }

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
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/swap-plan`,
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
        ToastAndroid.show("successfull", ToastAndroid.LONG);
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

  function ValidateAndSubmit() {
    if (form.source == form.destination) {
      return setError("source cannot be same as destination");
    }
    setAuthenticate(true);
  }

  useEffect(() => {
    fetch_plans();
  }, []);

  return (
    <ScrollView
      className="dark:bg-bgDark bg-bgLight"
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={async () => {
            await fetch_plans();
            setRefreshing(false);
          }}
          progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor}
        />
      }
    >
      {authenticate && (
        <PinModalComponent
          isVisible={authenticate}
          onClose={() => setAuthenticate(false)}
          onValidate={() => ValidateAndSubmit()}
        />
      )}
      {fetching && <LoaderScreen />}
      <View
        className="dark:bg-dark bg-light flex-1 px-5 py-14 mx-2 rounded-xl"
        style={{ minHeight: screenHeight }}
      >
        <View className="mb-10">
          <View className="mb-5">
            <Text className="dark:text-light text-lg mb-3 px-2">Source</Text>
            <View className="dark:bg-bgDark bg-bgLight">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.source}
                onValueChange={(val) => setForm({ ...form, source: val })}
              >
                {plans.map((pl: any) => (
                  <Picker.Item
                    value={pl.name}
                    label={pl.label}
                    key={pl.name}
                  ></Picker.Item>
                ))}
              </Picker>
            </View>
          </View>

          <View>
            <Text className="dark:text-light text-lg mb-3 px-2">
              Destination
            </Text>
            <View className="dark:bg-bgDark bg-bgLight">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.destination}
                onValueChange={(val) => setForm({ ...form, destination: val })}
              >
                {plans.map((pl: any) => (
                  <Picker.Item
                    value={pl.name}
                    label={pl.label}
                    key={pl.name}
                  ></Picker.Item>
                ))}
              </Picker>
            </View>
          </View>
        </View>

        <View>
          <View className="">
            <Text className="text-xl font-semibold text-primary mb-3 px-1">
              Amount in USD ($):
            </Text>
            <AmountSection
              inputValue={form.amount}
              onButtonClick={(p) => setForm({ ...form, amount: p })}
              onTextChange={(val) => setForm({ ...form, amount: val })}
            />
          </View>
        </View>

        <SubmitButtonWrapper
          label="Swap Plan"
          errorMessage={error}
          isLoading={isLoading}
          onSubmit={() => submit()}
        />
      </View>
    </ScrollView>
  );
};

export default SwapPlan;
