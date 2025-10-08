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
  const {available_balance} = useLocalSearchParams()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [authenticate, setAuthenticate] = useState(false);

  const [form, setForm] = useState({
    amount: "",
    channel: "",
    // network: "",
    wallet_address: "",
  });

  function updateForm(key: keyof typeof form, val: string) {
    setError(null);
    setForm({ ...form, [key]: val });
  }

  async function ValidateFormAndAuthenticate() {
    try {
      setIsLoading(true);
      if (Number(form.amount) > Number(available_balance)) {
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
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/withdrawal`,
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
        ToastAndroid.show("Request submitted", ToastAndroid.LONG);
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
                Available for withdraw
              </Text>
              <Balance amount={Number(available_balance)} />
            </View>

            <View className="mb-7">
              <View>
                <Text className="text-primary text-lg font-bold mb-5">
                  Withdrawal To
                </Text>
                <View className="border rounded-md dark:bg-slate-800 bg-slate-100 mb-5">
                  <Picker
                    style={{ color: textColor }}
                    dropdownIconColor={textColor}
                    selectedValue={form.channel}
                    onValueChange={(val: string) => updateForm("channel", val)}
                  >
                    {
                      cryptoChannels.map((channel) => <Picker.Item label={channel.name} value={channel.name} key={channel.name} />)
                    }
                  </Picker>
                </View>
                {/* <View className=" rounded-lg mb-8">
                  <TextInput
                    placeholder="Network"
                    className=" px-3  py-4 text-lg font-semibold dark:bg-slate-800 bg-slate-100 rounded-lg dark:text-light"
                    placeholderTextColor={textColor}
                    onChangeText={(val) => updateForm("network", val)}
                  />
                </View> */}
                <View
                  style={{ position: "relative" }}
                  className=" rounded-lg dark:bg-slate-800 bg-slate-100"
                >
                  <Text
                    style={{ position: "absolute", top: -12, left: 0 }}
                    className="dark:bg-slate-800 bg-slate-100 px-3 text-lg font-semibold dark:text-light rounded-md"
                  >
                    Wallet Address
                  </Text>
                  <TextInput
                    multiline
                    className="py-5 px-4 dark:text-light"
                    onChangeText={(val) => updateForm("wallet_address", val)}
                  />
                </View>
              </View>
            </View>

            <View>
              <Text className="text-primary text-lg font-bold mb-5">
                Amount to Withdraw
              </Text>
              <AmountSection
                inputValue={form.amount}
                onButtonClick={(p) => updateForm("amount", p)}
                onTextChange={(val) => updateForm("amount", val)}
              />
            </View>

            <SubmitButtonWrapper
              label="Withdraw"
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
  channel: z.string().min(1, { message: "select a valid deposit channel" }),
  // network: z.string().min(1, { message: "Network field cannot be empty" }),
  wallet_address: z
    .string()
    .min(1, { message: "Wallet address field is required" }),
});

const cryptoChannels = [
  { name: "Bitcoin", ticker: "BTC", network: "Bitcoin" },
  { name: "Ethereum", ticker: "ETH", network: "Ethereum Mainnet" },
  { name: "Binance Coin", ticker: "BNB", network: "BNB Smart Chain" },
  { name: "USDT (ERC-20)", ticker: "USDT", network: "Ethereum" },
  { name: "USDT (BEP-20)", ticker: "USDT", network: "BNB Smart Chain" },
  { name: "USDT (TRC-20)", ticker: "USDT", network: "Tron" },
  { name: "USDC", ticker: "USDC", network: "Ethereum" },
  { name: "Solana", ticker: "SOL", network: "Solana" },
  { name: "Polygon", ticker: "MATIC", network: "Polygon" },
  { name: "Avalanche", ticker: "AVAX", network: "Avalanche C-Chain" },
  { name: "Litecoin", ticker: "LTC", network: "Litecoin" },
  { name: "Dogecoin", ticker: "DOGE", network: "Dogecoin" },
  { name: "DAI", ticker: "DAI", network: "Ethereum" },
  { name: "Fantom", ticker: "FTM", network: "Fantom Opera" },
  { name: "Arbitrum", ticker: "ETH", network: "Arbitrum One" },
  { name: "Optimism", ticker: "ETH", network: "Optimism" },
];
