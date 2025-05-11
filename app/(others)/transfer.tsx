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
  const [reciever, setReciever] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    user: "",
    amount: "0",
  });

  async function getRecieverName() {
    try {
      setIsLoading(true);
      setReciever(null);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/account/transfer/reciever_name/?user=${form.user}`
      );
      const res = await req.json();

      if (res.success) {
        return setReciever(res.fullname);
      }
    } catch (error: any) {
    } finally {
      setIsLoading(false);
    }
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
              <Text className="dark:text-light mb-3">Account</Text>
              <TextInput
                readOnly
                value="DIGITAL ASSETS"
                className="dark:bg-dark bg-light dark:text-light h-16 px-5 rounded-xl"
              />
            </View>

            <View className="mb-10">
              <Text className="dark:text-light mb-3">Username / Email</Text>
              <TextInput
                value={form.user}
                placeholder="digital001"
                className="dark:bg-dark bg-light dark:text-light h-16 px-5 rounded-xl mb-5"
                onChangeText={(val) => setForm({ ...form, user: val })}
                onBlur={() => getRecieverName()}
                returnKeyType="done"
                inputMode="text"
              />
              <Text className="text-primary text-xl font-semibold capitalize">
                {reciever}
              </Text>
            </View>

            {reciever && (
              <View>
                <Text className="dark:text-light mb-3">Amount</Text>
                <TextInput
                  value={form.amount}
                  placeholder="0.00"
                  inputMode="decimal"
                  onChangeText={(val) => setForm({ ...form, amount: val })}
                  className="dark:bg-dark bg-light dark:text-light h-16 px-5 rounded-xl mb-5"
                />
              </View>
            )}
          </View>

          <View className="mt-10">
            {reciever && Number(form.amount) > 0 ? (
              <TouchableOpacity className="bg-primary py-3 rounded-lg">
                <Text className="text-light text-center font-semibold">
                  Transfer
                </Text>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity className="bg-primary py-3 rounded-lg">
                <Text className="text-light text-center font-semibold">
                  Next
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>
      </View>
    </View>
  );
};

export default Transfer;
