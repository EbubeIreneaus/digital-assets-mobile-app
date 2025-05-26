import React, { useCallback, useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Pressable,
  Button,
  RefreshControl,
} from "react-native";
import Colors from "@/lib/color";
import { FontAwesome, FontAwesome5, MaterialIcons } from "@expo/vector-icons";
import Currency from "@/lib/currency";
import { getToken } from "@/lib/authToken";
import { useRouter } from "expo-router";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import LoaderScreen from "@/components/LoaderScreen";
import useAppTheme from "@/lib/appTheme";

const CheckBox = ({
  label,
  isChecked,
  onPress,
}: {
  label: string;
  isChecked: boolean;
  onPress: () => void;
}) => {
  return (
    <TouchableOpacity
      className="flex-row justify-between items-center dark:bg-dark mb-4 bg-light h-32 px-5 rounded-lg"
      onPress={onPress}
    >
      <Text className="dark:text-light">{label}</Text>
      {isChecked ? (
        <MaterialIcons
          name="radio-button-checked"
          size={24}
          color={Colors.primary}
        />
      ) : (
        <MaterialIcons
          name="radio-button-unchecked"
          size={24}
          className="dark:!text-light"
        />
      )}
    </TouchableOpacity>
  );
};

const DepositIndex = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [payMethods, setPayMethods] = useState<{ name: string }[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const router = useRouter();
  const [fetching, setFetching] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [form, setForm] = useState({
    amount: 0,
    channel: "BTC",
  });

  async function getCrypto() {
    try {
      setFetching(true);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/admin/crypto-channels`
      );
      const res = await req.json();
      if (res.success) {
        setPayMethods(res.data);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setFetching(false);
    }
  }

  useEffect(() => {
    getCrypto();
  }, []);

  const Deposit = async () => {
    setIsLoading(true);
    const token = await getToken();
    const q = form;
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/deposit`,
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            Authorization: `Bearer ${(await token) ?? null}`,
          },
        }
      );
      const res = await req.json();

      if (res.success) {
        const query = `amount=${q.amount}&channel=${q.channel}&id=${res.id}`;
        setForm({
          amount: 0,
          channel: "BTC",
        });
        return router.push(`/deposit/checkout?${query}`);
      }

      setError(res.code);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const refresh = useCallback(async () => {
    await getCrypto();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          progressBackgroundColor={bgColor}
          colors={[textColor]}
          tintColor={textColor}
        />
      }
      className="flex-1 dark:bg-bgDark bg-bgLight p-5"
    >
      <View className="flex-1 justify-center">
        <View className="mb-12 mt-5">
          <Text className="dark:text-light mb-3 px-1">Enter Amount</Text>
          <TextInput
            className="dark:bg-dark bg-light dark:text-light w-full !h-16 px-5 rounded-md"
            placeholder="Amount (USD)"
            placeholderTextColor={Colors.primary}
            inputMode="decimal"
            onChangeText={(val) => setForm({ ...form, amount: Number(val) })}
          />
        </View>

        <View className="mb-5">
          <Text className="text-2xl font-bold dark:text-light mb-5">
            Please Choose a method of payment
          </Text>
          <View>
            {payMethods.map((pm) => (
              <CheckBox
                label={pm.name}
                isChecked={form.channel === pm.name}
                onPress={() => setForm({ ...form, channel: pm.name })}
                key={pm.name}
              />
            ))}
          </View>
        </View>

        <View className="px-5 py-10 dark:bg-dark bg-light rounded-lg">
          <Text className="dark:text-light text-xl ">Deposit Overview</Text>
          <View className="my-10">
            <View className="flex-row justify-between mb-6">
              <Text className="dark:text-light tex-lg font-semibold">
                Amount
              </Text>
              <Text className="dark:text-light text-lg">
                {Currency(form.amount)}
              </Text>
            </View>
            <View className="flex-row justify-between">
              <Text className="dark:text-light tex-lg font-semibold">
                Channel
              </Text>
              <Text className="dark:text-light text-lg">{form.channel}</Text>
            </View>
          </View>

          <SubmitButtonWrapper
            label="Make Deposit"
            errorMessage={error}
            isLoading={isLoading}
            onSubmit={() => Deposit()}
          />
        </View>
      </View>

      {fetching && <LoaderScreen />}
    </ScrollView>
  );
};

export default DepositIndex;
