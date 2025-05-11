import InvestmentMiniCard from "@/components/InvestmentMiniCard";
import { getToken } from "@/lib/authToken";
import { Link, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ToastAndroid, ScrollView } from "react-native";

export function NoPlan() {
  return (
    <View className="flex-1 justify-center items-center">
      <View>
        <Text className="dark:text-light mb-6 text-lg font-semibold">
          You have no active plan
        </Text>
        <Link href="/plan/tradingPlan" asChild>
          <TouchableOpacity className="bg-primary h-14 items-center justify-center rounded-lg px-10">
            <Text className="text-light">Click to buy plan</Text>
          </TouchableOpacity>
        </Link>
      </View>
    </View>
  );
}

const MyPlan = () => {
  const [investments, setInvestments] = useState([]);

  async function fetchData() {
    const token = await getToken();
    if (!token) {
      return router.push("/auth/sign-in");
    }

    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/invest/`,
        {
          headers: {
            "profile-id": token.profileId,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        return setInvestments(res.data);
      }

      ToastAndroid.show("server error occured", ToastAndroid.LONG);
    } catch (error) {
      ToastAndroid.show("server error occured", ToastAndroid.LONG);
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  return (
    <View className="dark:bg-bgDark bg-bgLight flex-1">
      {!investments || investments.length < 1 ? (
        <NoPlan />
      ) : (
        <View className="flex-1">
            <View className="mb-10 bg-primary py-5 px-3">
                <Text className="text-xl font-extrabold dark:text-light">My Active Orders:</Text>
            </View>
            <ScrollView className="flex-1 px-3">
                {
                    investments.map((iv: any) => <InvestmentMiniCard key={iv.id} investment={iv} />)
                }
            </ScrollView>
        </View>
      )}
    </View>
  );
};

export default MyPlan;
