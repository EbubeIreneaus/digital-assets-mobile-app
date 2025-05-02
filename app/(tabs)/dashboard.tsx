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
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import BalanceCard from "@/components/BalanceCard";
import BoxLink from "@/components/BoxLink";
import AsyncStorage from "@react-native-async-storage/async-storage";
import TransactionItem from "@/components/TransactionItem";

const Dashboard = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [profile, setProfile] = useState<any>(null);
  const [account, setAccount] = useState(null);
  const [transaction, setTransactions] = useState(null);

  async function getToken() {
    let token: any = await AsyncStorage.getItem("user");
    token = JSON.parse(token);
    return token;
  }

  const getUserDetails = async () => {
    try {
      const token = await getToken();
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/details/${token.profileId}`
      );
      const res = await req.json();
      if (res.success) {
        delete res.success;
        setProfile(res.data.profile);
        delete res.data.profile;
        setAccount(res);
      }
    } catch (error: any) {
      console.log(error.message);
    }
  };

  const getTransaction = async () => {
    const token = await getToken();
    console.log("res: ", process.env.EXPO_PUBLIC_API_URL);
    const req = await fetch(
      `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/getTransact/?profileId=${token?.profileId}&limit=5`
    );
    const res = await req.json();
    if (res.success) {
      setTransactions(res.data);
    }
  };

  useEffect(() => {
    getUserDetails();
    getTransaction();
  }, []);

  return (
    <View className="flex-1 bg-bgLight dark:bg-bgDark py-5">
      <View
        style={{ flexDirection: "row" }}
        className="justify-between items-center mb-10 px-5"
      >
        <View className="flex-row items-center gap-3 ">
          <Image
            source={require("@/assets/images/user-placeholder.png")}
            style={{ width: 45, height: 45 }}
            className="border-4 border-primary rounded-full"
          />
          <Text className="text-xl font-bold text-dark dark:text-light">
            Hi, {profile?.user?.last_name.split(' ')[0] ?? "Guest"}
          </Text>
        </View>
        <MaterialIcons name="chat" size={25} className="!text-primary" />
      </View>
      <BalanceCard />

      <View className="my-7 px-3">
        <View className="mb-3">
          <Text className="text-sm text-primary">Quick Access</Text>
        </View>
        <View className="flex-row gap-x-2 ">
          <BoxLink
            href="/"
            icon="candlestick-chart"
            title="Trading Plan"
            iconColor="orange"
          />
          <BoxLink
            href="/"
            icon="trending-up"
            title="My Plan"
            iconColor="green"
          />
          <BoxLink
            href="/"
            icon="swap-calls"
            title="Convert"
            iconColor="purple"
          />
          <BoxLink href="/" icon="share" title="Transfer" iconColor="blue" />
        </View>
      </View>

      <View className="my-7 px-3">
        <View className="mb-5 flex-row justify-between">
          <Text className="text-sm text-primary">Transactions</Text>
          <Link href="/" className="dark:text-light flex-row items-center">
            <Text>see more</Text>
            <MaterialIcons name="chevron-right" size={10} />
          </Link>
        </View>
        <View>
          <FlatList
            data={transaction}
            renderItem={({ item }) => <TransactionItem item={item} />}
            keyExtractor={(item) => item.id}
          />
        </View>
      </View>
    </View>
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
