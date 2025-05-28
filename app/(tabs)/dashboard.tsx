
import useAppTheme from "@/lib/appTheme";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
  RefreshControl,
  TouchableOpacity,
  Linking
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BalanceCard from "@/components/BalanceCard";
import BoxLink from "@/components/BoxLink";
import Toast from 'react-native-simple-toast'
import TransactionItem from "@/components/TransactionItem";
import { getToken } from "@/lib/authToken";
import LoaderScreen from "@/components/LoaderScreen";
const screenHeight = Dimensions.get("window").height;
const Dashboard = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [support, setSupport] = useState('')
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false)

  const fetchData = async () => {
    try {
      setIsLoading(true);
      const token = await getToken();
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/db-data`,
        {
          headers: {
            Authorization: `Bearer ${token || null}`,
          },
        }
      );

      const res = await req.json();

      if (res.success) {
        setUser(res.user);
        setAccount(res.account);
        setTransactions(res.transactions);
        setSupport(res.support)
        return true;
      }
      Toast.show("unknown server error", Toast.LONG);
    } catch (error: any) {
      Toast.show("unknown server error", Toast.LONG);
      console.log(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const onRefresh = useCallback(async () => {
    await fetchData()
    setRefreshing(false)
  },[])

  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor} />
    }>
      <View
        style={{ minHeight: screenHeight - 30 }}
        className="flex-1 bg-bgLight dark:bg-bgDark py-5"
      >
        <View
          style={{ flexDirection: "row" }}
          className="justify-between items-center mb-10 px-5"
        >
          <View className="flex-row items-center gap-3 ">
            <Image
              source={
                user?.profile_pics
                  ? { uri: process.env.EXPO_PUBLIC_API_URL + user.profile_pics }
                  : require("@/assets/images/user-placeholder.png")
              }
              style={{ width: 45, height: 45 }}
              className="border-4 border-primary rounded-full"
            />
            <Text className="text-xl font-bold text-dark dark:text-light">
              Hi, {user?.fullname.trim().split(" ")[0] ?? "Guest"}
            </Text>
          </View>
          <TouchableOpacity onPress={async () => {
            if(await Linking.canOpenURL(support)){
              return Linking.openURL(support)
            }
            Toast.show('Telegram app not installed on device', Toast.LONG)
          }}>
          <MaterialIcons name="support-agent" size={25} className="dark:!text-light !text-dark" />
          </TouchableOpacity>
        </View>

        <BalanceCard
          account={account ?? { balance: 0, available_balance: 0 }}
        />

        <View className="my-7 px-3">
          <Text className="text-sm dark:text-light mb-4">Quick Access</Text>
          <View className="flex-row flex-wrap gap-2">
            <BoxLink
              href="/booking/"
              icon="flight-takeoff"
              title="Bookings"
              iconColor="green"
            />
            <BoxLink
              href="/plan/tradingPlan"
              icon="candlestick-chart"
              title="Trading Plan"
              iconColor="orange"
            />
            <BoxLink
              href="/plan/SwapPlan"
              icon="swap-calls"
              title="Convert"
              iconColor="purple"
            />
            <BoxLink
              href="/transfer"
              icon="share"
              title="Transfer"
              iconColor="blue"
            />
            <BoxLink
              href="/plan/tradingPlan"
              icon="money"
              title="Buy Plan"
              iconColor="gray"
            />
            <BoxLink
              href="/plan/tradingPlan"
              icon="savings"
              title="Sell Plan"
              iconColor="pink"
            />
          </View>
        </View>
        <View className="mt-5 px-3">
          <View className="flex-row justify-between mb-4">
            <Text className="text-sm dark:text-light">Transactions</Text>
            <Link
              href="/transactions"
              className="dark:text-light flex-row items-center"
            >
              <Text>see more</Text>
              <MaterialIcons name="chevron-right" size={10} />
            </Link>
          </View>

          <View>
            {transactions.length < 1 ? (
              <View className="min-h-[300px] justify-center items-center">
                <Text className="text-primary text-lg font-semibold">
                  No Recent transaction
                </Text>
              </View>
            ) : (
              <View className="py-7">
                {transactions.map((tr: any) => (
                  <TransactionItem item={tr} key={tr.id} />
                ))}
              </View>
            )}
          </View>
        </View>
      </View>

      {isLoading && <LoaderScreen />}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default Dashboard;
