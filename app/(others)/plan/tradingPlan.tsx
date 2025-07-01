import { Picker } from "@react-native-picker/picker";
import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  Image,
  RefreshControl,
} from "react-native";
import { InvestPlan } from "@/lib/plan";
import Currency from "@/lib/currency";
import { getToken } from "@/lib/authToken";
import { Link, router } from "expo-router";
import LoaderScreen from "@/components/LoaderScreen";
import Toast from "react-native-simple-toast";
import useAppTheme from "@/lib/appTheme";
// Adjust the path as needed

const MyPlan = Object.keys(InvestPlan) as Array<keyof typeof InvestPlan>;
const tradingPlan = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [account, setAccount] = useState({ total_invested: 0, total_gain: 0 });
  const [plans, setPlans] = useState<any>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  async function fetchData() {
    try {
      const token = await getToken();
      if (!token) {
        return router.push("/auth/sign-in");
      }
      setIsLoading(true);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/trading-plan`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();

      if (res.success) {
        setPlans(res.plans);
        return setAccount(res.account);
      }

      Toast.show("unknown server error", Toast.LONG);
    } catch (error) {
      Toast.show("unknown server error", Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  const refresh = useCallback(async () => {
    await fetchData();
    setRefreshing(false);
  }, []);

  return (
    <ScrollView
      className="flex-1 dark:bg-bgDark bg-bgLight "
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          progressBackgroundColor={bgColor}
          colors={[textColor]}
          tintColor={textColor}
        />
      }
    >
      <View className="dark:bg-dark bg-light flex-1 px-7 py-5 m-5 rounded-xl">
        <View className="mb-14">
          <View className="mb-7">
            <Text className="dark:text-light font-semibold text-2xl">
              My Investment
            </Text>
          </View>
          <View className="flex-row justify-between items-center">
            <View>
              <Text className="text-3xl font-bold dark:text-light">
                {Currency(account.total_invested)}
              </Text>
              <Text className="text-primary">Total Invested</Text>
            </View>

            <View>
              <Text className="text-3xl font-bold dark:text-light">
                {Currency(account.total_gain)}
              </Text>
              <Text className="text-primary text-center">Total Gain</Text>
            </View>
          </View>
        </View>

        <View className="py-10 border-b border-t dark:border-light/10 mb-10">
          <View className="flex-row justify-between items-center mb-10">
            <Text className="dark:text-light text-lg">Total Value $</Text>
            <Text className="dark:text-light text-lg font-semibold">
              {Currency(account.total_invested)}
            </Text>
          </View>

          <View className="flex-row justify-between items-center mb-5">
            <Text className="dark:text-light text-lg">Total Gain $</Text>
            <Text className="dark:text-light text-lg font-semibold">
              {Currency(account.total_gain)}
            </Text>
          </View>
        </View>

        <View>
          <View className="mb-10">
            <View>
              <Text className="text-xl dark:text-light font-bold mb-7 uppercase">
                Investment Plans
              </Text>
              <Text className="text-primary">Daily Percentage Gain</Text>
            </View>
          </View>

          <View>
            {plans.map((plan: any) => (
              <Link
                href={`/plan/myPlan?p=${plan.name}`}
                asChild
                key={plan.name}
              >
                <TouchableOpacity className="flex-row justify-between items-center py-3  mb-5">
                  <Image
                    source={{
                      uri: `${process.env.EXPO_PUBLIC_API_URL}/${plan.icon}`,
                    }}
                    className="size-[30px]"
                  />
                  <Text className="text-lg capitalize font-semibold dark:text-light">
                    {plan.label}
                  </Text>
                  <Text className="text-lg dark:text-light dark:bg-slate-100/20 bg-slate-950/20 px-3 py-1.5 rounded-lg w-fit">
                   {plan.roi.toString()[0].startsWith("-")?'':'+'} {plan.roi}%
                  </Text>
                </TouchableOpacity>
              </Link>
            ))}
          </View>
        </View>
      </View>

      {isLoading && <LoaderScreen />}
    </ScrollView>
  );
};

export default tradingPlan;
