import useAppTheme from "@/lib/appTheme";
import { Link } from "expo-router";
import React, { useEffect, useState } from "react";
import {
  Text,
  View,
  StyleSheet,
  Image,
  Pressable,
  FlatList,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BalanceCard from "@/components/BalanceCard";
import BoxLink from "@/components/BoxLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TransactionItem from "@/components/TransactionItem";
import { getToken } from "@/lib/authToken";

const Dashboard = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [user, setUser] = useState<any>(null);
  const [account, setAccount] = useState(null);
  const [transactions, setTransactions] = useState([]);

  const fetchData = async () => {
    try {
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
        return true;
      }
      ToastAndroid.show("unknown server error", ToastAndroid.LONG);
    } catch (error: any) {
      ToastAndroid.show("unknown server error", ToastAndroid.LONG);
      console.log(error.message);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <ScrollView>
      <View className="flex-1 bg-bgLight dark:bg-bgDark py-5">
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
              Hi, {user?.fullname.split(" ")[1] ?? "Guest"}
            </Text>
          </View>
          <MaterialIcons name="chat" size={25} className="!text-primary" />
        </View>

        <BalanceCard
          account={account ?? { balance: 0, available_balance: 0 }}
        />

        <View className="my-7 px-3">
          <Text className="text-sm dark:text-light mb-4">Quick Access</Text>
          <View className="flex-row gap-x-2">
            <BoxLink
              href="/plan/tradingPlan"
              icon="candlestick-chart"
              title="Trading Plan"
              iconColor="orange"
            />
            <BoxLink
              href="/plan/myPlan"
              icon="trending-up"
              title="My Plan"
              iconColor="green"
            />
            <BoxLink
              href="/convert"
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
          </View>
        </View>
        <View className="mt-5 px-3">
          <View className="flex-row justify-between mb-4">
            <Text className="text-sm dark:text-light">Transactions</Text>
            <Link href="/transactions" className="dark:text-light flex-row items-center">
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
