import InvestmentMiniCard from "@/components/InvestmentMiniCard";
import { getToken } from "@/lib/authToken";
import { Link, router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useLayoutEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  Image,
  FlatList,
  RefreshControl,
} from "react-native";
import Toast from 'react-native-simple-toast'
import Currency from "@/lib/currency";
import { MaterialIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";
import TransactionItem from "@/components/TransactionItem";
import useAppTheme from "@/lib/appTheme";

const MyPlan = () => {
  const { p } = useLocalSearchParams();
    const { bgColor, textColor, backgroundColor } = useAppTheme();
  const navigation = useNavigation();
  const [transactions, setTransactions] = useState([]);
  const [plan, setPlan] = useState<any>(null);
  const [planBalance, setPlanBalance]= useState(0);
  const [refreshing, setRefreshing] = useState(false)



  async function fetchData() {
    const token = await getToken();
    if (!token) {
      return router.push("/auth/sign-in");
    }

    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/investment/plan/${p}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        setTransactions(res.transactions);
        setPlan(res.plan);
        setPlanBalance(res.balance);
        return true;
      }

      Toast.show("server error occured", Toast.LONG);
    } catch (error) {
      Toast.show("server error occured", Toast.LONG);
    }
  }

  useEffect(() => {
    fetchData();
  }, []);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: `${plan?.label} Plan`,
    });
  }, [navigation, plan]);

 const refresh = useCallback(async () => {
    await fetchData()
    setRefreshing(false)
  }, [])

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight " refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor} />}>
      <View className="m-3 rounded-xl dark:bg-dark bg-light px-4">
        <View className="flex-1 w-full py-10">
          <Image
            source={require("@/assets/images/chart_line_graph.png")}
            style={{ height: 200, width: "100%" }}
            className="mt-[110px]"
          />
          <View
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              width: "100%",
              height: "100%",
            }}
            className="py-20 items-center"
          >
            <View>
              <Text className="text-5xl font-bold  dark:text-light mb-2">
                {Currency(planBalance)}
              </Text>
              <View className="flex-row justify-center gap-2 items-center">
                <Text className="text-primary font-semibold">
                  +{plan?.roi}%
                </Text>
                <Text className="text-primary text-lg font-semibold">
                  Today
                </Text>
              </View>
            </View>
          </View>
        </View>

        <View className="flex-row justify-between gap-x-3">
          <Link
            href={`/plan/BuyPlan?plan=${plan?.name}&planLabel=${plan?.label}&planIcon=${plan?.icon}&planRoi=${plan?.roi}`}
            asChild
          >
            <TouchableOpacity className="dark:bg-bgDark bg-bgLight py-4 rounded-lg flex-row items-center justify-center gap-x-3 flex-1">
              <MaterialIcons name="payments" size={24} color="blue" />
              <Text className="dark:text-light">Buy</Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={`/plan/SellPlan?plan=${plan?.name}&planLabel=${plan?.label}&planBalance=${planBalance}`}
            asChild
          >
            <TouchableOpacity className="dark:bg-bgDark bg-bgLight py-4 rounded-lg flex-row items-center justify-center gap-x-3 flex-1">
              <MaterialIcons name="attach-money" size={24} color="purple" />
              <Text className="dark:text-light">Sell</Text>
            </TouchableOpacity>
          </Link>

          <Link
            href={`/plan/SwapPlan?plan=${plan?.name}&planLabel=${plan?.label}&planBalance=${planBalance}`}
            asChild
          >
            <TouchableOpacity className="dark:bg-bgDark bg-bgLight py-4 rounded-lg flex-row items-center justify-center gap-x-3 flex-1">
              <MaterialIcons
                name="currency-exchange"
                size={24}
                color={Colors.primary}
              />
              <Text className="dark:text-light">Swap</Text>
            </TouchableOpacity>
          </Link>
        </View>

        <View className="flex-1 mt-16">
          <Text className="dark:text-light text-3xl font-extrabold">
            Recent Transaction
          </Text>
          {
            transactions.length < 1 ? (
              <View className="min-h-[300px] justify-center items-center">
                <Text className="text-primary text-lg font-semibold">
                  No Recent transaction
                </Text>
              </View>
            ) : (
              <View className="py-7">
                {
                  transactions.map((tr: any) => (<TransactionItem item={tr} key={tr.createdAt} />))
                }
              </View>
            )
          }
        </View>
      </View>
    </ScrollView>
  );
};

export default MyPlan;
