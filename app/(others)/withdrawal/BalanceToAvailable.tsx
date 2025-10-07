import AmountSection from "@/components/AmountSection";
import Balance from "@/components/Balance";
import PinModalComponent from "@/components/PinModalComponent";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import useAppTheme from "@/lib/appTheme";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import z from "zod";
import {
  ScrollView,
  View,
  TouchableOpacity,
  TextInput,
  Text,
  Dimensions,
  ToastAndroid,
} from "react-native";
import { getToken } from "@/lib/authToken";
import { router, useLocalSearchParams } from "expo-router";

const screenHeight = Dimensions.get("window").height;

const WithdrawalIndex = () => {
  const { textColor } = useAppTheme();
  const {balance} = useLocalSearchParams()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticate, setAuthenticate] = useState(false);

  const [form, setForm] = useState({
    amount: "",
  });

  function updateForm(key: keyof typeof form, val: string) {
    setError(null);
    setForm({ ...form, [key]: val });
  }

  async function ValidateFormAndAuthenticate() {
    try {
      setIsLoading(true);
      if (Number(form.amount) > Number(balance)) {
        return setError("Insufficient Wallet Balance");
      }

      const { data, error } = FormSchema.safeParse(form);
      if (error) {
        return setError(error.issues[0].message);
      }
      setForm(data as any);
      setIsLoading(false);
      setAuthenticate(true);
    } catch (error) {
    } finally {
      setIsLoading(false);
    }
  }

  async function submitForm() {
    try {
      const token = await getToken();
      setIsLoading(true);
      setError(null);
      setAuthenticate(false);

      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/withdrawal/to-balance`,
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const res = await req.json();
      if (res.success) {
        ToastAndroid.show("Request submited & pending", ToastAndroid.LONG);
        return router.replace("/dashboard");
      }
      setError(res.msg);
    } catch (error) {
      setError("unexpected error occured, try agin later.");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView>
      <View
        style={{ minHeight: screenHeight }}
        className="dark:bg-bgDark bg-bgLight"
      >
        <View className="dark:bg-dark bg-light flex-1  m-3 rounded-lg p-5">
          <View>
            <View className="py-5 mb-5">
              <Text className="dark:text-light/70 text-lg mb-3">
                Balance
              </Text>
              <Balance amount={Number(balance)} />
            </View>

            <View className="mb-7">
              <View>
                <Text className="text-primary text-lg font-bold mb-5">
                  Send To
                </Text>
                <View className="border rounded-md dark:bg-slate-800 bg-slate-100 mb-5">
                  <Picker
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    enabled={false}
                  >
                    <Picker.Item label="Available Balance" />
                  </Picker>
                </View>
              </View>
            </View>

            <View>
              <Text className="text-primary text-lg font-bold mb-5">
                Amount
              </Text>
              <AmountSection
                inputValue={form.amount}
                onButtonClick={(p) => updateForm("amount", p)}
                onTextChange={(val) => updateForm("amount", val)}
              />
            </View>

            <SubmitButtonWrapper
              label="Send"
              isLoading={isLoading}
              errorMessage={error}
              onSubmit={() => ValidateFormAndAuthenticate()}
            />
          </View>
        </View>

        {authenticate && (
          <PinModalComponent
            isVisible={authenticate}
            onClose={() => setAuthenticate(false)}
            onValidate={() => submitForm()}
          />
        )}
      </View>
    </ScrollView>
  );
};

export default WithdrawalIndex;

const FormSchema = z.object({
  amount: z.coerce
    .number({ message: "amount is invalid" })
    .min(1, { message: "amount is invalid" }),
});
