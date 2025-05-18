import useAppTheme from "@/lib/appTheme";
import { FontAwesome, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
} from "react-native";


const Transfer = () => {
  const {textColor} = useAppTheme()
  const [reciever, setReciever] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null)
  const [form, setForm] = useState({
    user: "",
    amount: "0",
  });

  async function getRecieverName() {
    try {
      if (form.user == '') {
        return setError('enter user email address')
      }
      setIsLoading(true);
      setReciever(null);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/transfer/reciever-info/${form.user}`
      );
      const res = await req.json();
      console.log(res)

      if (res.success) {
        return setReciever(res.data);
      }
      setError(res.msg)
    } catch (error: any) {
      setError('unknown server error, try again.')
    } finally {
      setIsLoading(false);
    }
  }

  function PROCEED(){
    if (form.user == '' || !reciever) {
      return setError('Invelid account details')
    }

    const query =  `fullname=${reciever.fullname}&email=${form.user}&balance=${reciever.balance}&available_balance=${reciever.available_balance}`
    return router.push(`/transfer02?${query}`)
  }

  return (
    <View className="flex-1">
      <View className="bg-primary p-5">
        <Text className="text-xl font-semibold text-slate-300">Transfer</Text>
      </View>
      <View className="dark:bg-bgDark bg-bgLight flex-1 px-5 py-10">
        <ScrollView className="flex-1">
          <View className="flex-1">

            <View className="mb-10">
              <Text className="dark:text-light mb-3">Account Email</Text>
              <TextInput
                value={form.user}
                placeholder="example@gmail.com"
                placeholderTextColor={textColor}
                className="dark:bg-dark bg-light dark:text-light h-16 px-5 rounded-xl mb-5"
                onChangeText={(val) => {
                  setForm({ ...form, user: val })
                  if (reciever) {
                    setReciever(null)
                  }
                }}

                returnKeyType="done"
                inputMode="text"
              />
              {
                reciever && (
                  <View className="dark:bg-slate-950/50  bg-slate-200 p-4">
                    <Text className="dark:text-slate-500 text-slate-900  text-xl font-semibold capitalize">
                      {reciever.fullname}
                    </Text>
                  </View>
                )
              }
            </View>
          </View>

          <View className="mt-10">
            <Text className="text-red-500 text-center text-lg capitalize mb-2">{error}</Text>
            {
              !reciever ?  (
                <TouchableOpacity disabled={form.user === ''} className="bg-primary py-5 rounded-lg flex-row justify-center items-center gap-x-3"  onPress={() => getRecieverName()}>
                  {isLoading && <FontAwesome name="spinner" color={textColor} className="animate-spin" size={20}/>}
                  <Text className="text-light text-center font-semibold">
                    Next
                  </Text>
                </TouchableOpacity>
              ) : (
                <TouchableOpacity onPress={() => PROCEED()} className="bg-primary py-5 rounded-lg flex-row justify-center items-center gap-x-1 ">
                  <Text className="text-light text-center font-bold ">
                    procceed
                  </Text>
                  <MaterialIcons name="chevron-right" size={24} color='white' />
                </TouchableOpacity>
              )
            }
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Transfer;
