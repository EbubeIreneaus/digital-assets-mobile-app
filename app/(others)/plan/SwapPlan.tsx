import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import Currency from "@/lib/currency";
import { FontAwesome } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import { router, useLocalSearchParams } from "expo-router";
import React, { useEffect, useState } from "react";
import { ScrollView, View, Text, TouchableOpacity, TextInput, Dimensions, ToastAndroid } from "react-native";

const screenHeight = Dimensions.get('window').height

const SwapPlan = () => {
  const { plan } = useLocalSearchParams()
  const { textColor } = useAppTheme();
  const [error, setError] = useState<null | string>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [plans, setPlans] = useState([])

  const [form, setForm] = useState({
    amount: '0',
    source: plan ? String(plan): '',
    destination: ''
  })

  async function fetch_plans() {
    try {
      const token = await getToken()
      if (!token) {
        return router.replace('/auth/sign-in')
      }

      const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/investment/plans`)

      const res = await req.json()

      if (res.success) {

        return setPlans(res.plans)
      }
      return ToastAndroid.show('server error', ToastAndroid.SHORT)
    } catch (error) {
      return ToastAndroid.show('server error', ToastAndroid.SHORT)
    } finally {

    }
  }

  async function submit() {
    try {
      setIsLoading(true)
      setError(null)
      const token = await getToken()
      if (!token) {
        return router.replace('/auth/sign-in')
      }

      const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/account/swap-plan`, {
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
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetch_plans()
  }, [])

  return (
    <ScrollView className="dark:bg-bgDark bg-bgLight">
      <View className="dark:bg-dark bg-light flex-1 px-5 py-14 mx-2 rounded-xl" style={{ minHeight: screenHeight }}>

        <View className="mb-10">
          <View className="mb-5">
            <Text className="dark:text-light text-lg mb-3 px-2">Source</Text>
            <View className="dark:bg-slate-950/50 bg-slate-200">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.source}
                onValueChange={(val) => setForm({ ...form, source: val })}
              >
                {
                  plans.map((pl: any) => (
                    <Picker.Item
                      value={pl.name}
                      label={pl.label}
                      key={pl.name}
                    ></Picker.Item>
                  ))
                }
              </Picker>
            </View>
          </View>

          <View>
            <Text className="dark:text-light text-lg mb-3 px-2">
              Destination
            </Text>
            <View className="dark:bg-slate-950/50 bg-slate-200">
              <Picker
                style={{ color: textColor }}
                dropdownIconColor={textColor}
                selectedValue={form.destination}
                onValueChange={(val) => setForm({ ...form, destination: val })}
              >
                 {
                  plans.map((pl: any) => (
                    <Picker.Item
                      value={pl.name}
                      label={pl.label}
                      key={pl.name}
                    ></Picker.Item>
                  ))
                }
              </Picker>
            </View>
          </View>
        </View>

        <View>
          <View className="">
            <Text className="text-xl font-semibold text-primary mb-3 px-1">Amount in USD ($):</Text>
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
        </View>

        <View className="mt-10">
          <Text className="mb-3 text-red-500 text-center capitalize font-semibold">{error ? error : ''} </Text>
          <TouchableOpacity onPress={() => submit()} className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl">
            {isLoading && <FontAwesome name="spinner" size={20} color='white' className="!animat-spin" />}
            <Text className="text-light text-lg font-semibold">Sell Plan</Text>
          </TouchableOpacity>
        </View>

      </View>
    </ScrollView>
  );
};

export default SwapPlan;
