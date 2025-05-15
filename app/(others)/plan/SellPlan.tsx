import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { MaterialIcons, FontAwesome } from "@expo/vector-icons";
import { router, useLocalSearchParams, useNavigation } from "expo-router";
import React, { useLayoutEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, ScrollView, Dimensions, ToastAndroid } from "react-native";

const screenHeight = Dimensions.get('window').height - 70

const SellPlan = () => {
  const Navigation = useNavigation()
  const {planBalance, plan, planLabel} =  useLocalSearchParams();
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<null | string>(null)
  const [form, setForm] = useState({
    amount: "0",
    to: 'balance'
  });

 
  async function submit(){
    try {
      setIsLoading(false)
      setError(null)
      const token = await getToken()
      if (!token) {
        return router.replace('/auth/sign-in')
      }

      const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/account/sell-plan`, {
        method: 'POST',
        body: JSON.stringify({
          ...form, amount: Number(form.amount), plan: String(plan)
        }),
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })

      const res = await req.json()

      if (res.success) {
        ToastAndroid.show('successfull', ToastAndroid.LONG)
        return router.replace(`/plan/myPlan?p=${plan}`)
      }
      setError(res.msg)
    } catch (error) {
      console.log(error)
      setError('unknown server error, try again')
    }
  }

  useLayoutEffect(() => {
    Navigation.setOptions({
      title: `Sell ${planLabel} Shares`
    })
  }, [Navigation, planLabel])

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight">
      <View className="flex-1 justify-center" style={{minHeight: screenHeight}}>
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
            <Text className=" font-bold text-primary capitalize">{planLabel} Balance</Text>
          </View>
        </View>

        <View className="">
          <View>
            <TextInput
              inputMode="numeric"
              placeholder="0.00"
              value={form.amount}
              onChangeText={(val) => setForm({ ...form, amount: val })}
              placeholderClassName="dark:!text-light"
              className="py-4 px-3 dark:bg-slate-950/50 bg-slate-200 dark:text-light rounded-lg"
            />
          </View>
          <View className="flex-row gap-4 flex-wrap py-5">
            {[100, 200, 500, 1000, 2000, 5000, 10000].map((p) => (
              <TouchableOpacity
                key={p}
                className="py-4 px-6 dark:bg-slate-950/50 bg-slate-300 rounded-xl"
                onPress={() => setForm({ ...form, amount: p.toString() })}
              >
                <Text className="dark:text-slate-100">{Currency(p)}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View className="my-5">
          <Text className="text-primary text-xl font-semibold mb-3">Sell to:</Text>
          <View className="mb-4">
            <TouchableOpacity onPress={() => setForm({...form, to: 'balance'})} className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5">
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

              <MaterialIcons name="check-circle" size={15} color={form.to=='balance'?'green':''} />
            </TouchableOpacity>
          </View>

          <View className="">
            <TouchableOpacity onPress={() => setForm({...form, to: 'available_balance'})} className="flex-row justify-between items-center dark:bg-slate-950/50 bg-slate-300/50 rounded-xl px-4 py-5">
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

              <MaterialIcons name="check-circle" size={15} color={form.to=='available_balance'?'green':''} />
            </TouchableOpacity>
          </View>
        </View>

        <View className="mt-10">
            <Text className="mb-3 text-red-500 text-center capitalize font-semibold">{error?error:''} </Text>
            <TouchableOpacity onPress={()=>submit()} className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl">
               { isLoading && <FontAwesome name="spinner" size={20} color='white' className="!animat-spin" />}
              <Text className="text-light text-lg font-semibold">Sell Plan</Text>
            </TouchableOpacity>
          </View>
      </View>
      </View>
    </ScrollView>
  );
};

export default SellPlan;

