import Currency from "@/lib/currency";
import React, { useCallback, useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  RefreshControl,
  Dimensions,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from "expo-image-picker";
import { FontAwesome } from "@expo/vector-icons";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import LoaderScreen from "@/components/LoaderScreen";
import Toast from "react-native-simple-toast";
import useAppTheme from "@/lib/appTheme";
import * as Clipboard from 'expo-clipboard'

const screenHeight = Dimensions.get('window').height;

const Checkout = () => {
    const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [wallet, setWallet] = useState<any>(null);
  const query = useLocalSearchParams();
  const {
    channelId,
    amount,
    id,
  }: { channelId: string; amount: string; id: string } = query as any;
  const [image, setImage] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [refreshing, setRefreshing] = useState(false)

  async function openImagePicker() {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 1,
        allowsEditing: false,
      });

      if (!result.canceled) {
        setImage(result.assets[0]);
      }
    } catch (error) {}
  }
  async function getWallet() {
    try {
      setFetching(true);
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/channel/${channelId}`
      );
      const res = await req.json();
      console.log(res)
      if (res.success) {
        console.log(res.data)
        return setWallet(res.data);
      }
      Toast.show("unknown server error", Toast.LONG);
    } catch (error) {
      Toast.show("unexpected error occured, contact support", Toast.LONG);
      console.log("error fetching checkout deposit wallet details", error);
    } finally {
      setFetching(false);
    }
  }

  async function sendConfirmPayment() {
    try {
      setIsLoading(true);
      const formData = new FormData();
      const file = {
        uri: image?.uri,
        name: image?.fileName,
        type: image?.mimeType,
      } as any;

      formData.append("file", file);
      formData.append("channel", wallet?.name as any);
      formData.append("transactId", id as any);
      formData.append("amount", amount as any);

      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/pay_slip`,
        {
          method: "post",
          body: formData,
        }
      );
      const res = await req.json();
      if (res.status == "success") {
        Toast.show("Payment confirmation sent successfully", Toast.LONG);
        return router.replace("/deposit");
      }
      console.log("response", res);
      Toast.show("Unknown error occured", Toast.LONG);
    } catch (error) {
      Toast.show("Unknown error occured", Toast.LONG);
      console.log("error", error);
    } finally {
      setIsLoading(false);
    }
  }

  async function copyToClipboard() {
    if(!wallet?.wallet_address) return;
    await Clipboard.setStringAsync(wallet?.wallet_address);
    Toast.show("Copied to clipboard", Toast.SHORT);
  }
  useEffect(() => {
    getWallet();
  }, []);

  const refresh = useCallback(async ()=> {
    await getWallet()
    setRefreshing(false)
  }, [])
  return (
    <ScrollView  className="bg-bgLight dark:bg-bgDark flex-1 " refreshControl={<RefreshControl refreshing={refreshing} onRefresh={refresh} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor} />}>
      <View style={{ minHeight: screenHeight - 50 }} className="justify-center">
        <View className="dark:bg-dark bg-light rounded-xl mx-2 px-8 py-10">
        <Text className="text-2xl dark:text-light mb-10 font-extrabold ">
          PAYMENT INFORMATION
        </Text>
        <View className="shadow-inner flex-row gap-x-5 mb-6">
          <Text className="dark:text-light font-semibold text-lg">
            Payment Channel:
          </Text>
          <Text className="text-amber-500 text-lg">
            {wallet?.name.toUpperCase()}
          </Text>
        </View>

        {wallet?.network && (
          <View className="shadow-inner flex-row gap-x-5 mb-6">
            <Text className="dark:text-light font-semibold text-lg">
              Network:
            </Text>
            <Text className="text-amber-500 text-lg">
              {wallet?.network}
            </Text>
          </View>
        )}

        <View className="shadow-inner  flex-row gap-x-5 mb-7">
          <Text className="dark:text-light font-semibold text-lg">Amount:</Text>
          <Text className="text-amber-500 text-lg">
            {Currency(Number(amount))}
          </Text>
        </View>

        <View className="mb-10 items-center">
          <Image
            source={{
              uri: process.env.EXPO_PUBLIC_API_URL + wallet?.qrcode_image 
            }}
            style={{ width: 250, height: 250 }}
            className="my-6"
          />
          <View className="flex-row gap-5 flex-wrap">
            <Text className="dark:text-light text-lg">
              {wallet?.wallet_address}
            </Text>
            <TouchableOpacity onPress={copyToClipboard}>
              <Text className="text-primary  font-semibold underline underline-offset-4">
                copy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
          <Text className="font-extrabold dark:text-light mb-7 text-xl text-center">
            Send us payment reciept to process your payment
          </Text>
          <TouchableOpacity
            onPress={() => openImagePicker()}
            className="py-4 px-3 border dark:border-light rounded-lg"
          >
            <Text className="text-bold dark:text-light">
              Choose Photo: {image?.fileName}
            </Text>
          </TouchableOpacity>
        </View>

        <View>
          <SubmitButtonWrapper
            disabled={!image}
            label="I have made my payment"
            onSubmit={() => sendConfirmPayment()}
            isLoading={isLoading}
            errorMessage={null}
          />
        </View>
      </View>
      </View>

      {fetching && <LoaderScreen />}
    </ScrollView>
  );
};

export default Checkout;
