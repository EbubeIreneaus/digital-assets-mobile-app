import Currency from "@/lib/currency";
import { useLocalSearchParams } from "expo-router";
import React, { useEffect, useRef, useState } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import * as MediaLibrary from "expo-media-library";
import ViewShot, { captureRef } from "react-native-view-shot";
import Toast from "react-native-simple-toast";
import { getToken } from "@/lib/authToken";
import LoaderScreen from "@/components/LoaderScreen";

const TransactionDetails = () => {
  const { id }: { id: string } = useLocalSearchParams();
  const [src, setSrc] = useState<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [permissionResponse, requestPermision] = MediaLibrary.usePermissions();
  const containerRef = useRef<any>();
  const [transaction, setTransaction] = useState({
    type: "",
    createdAt: "",
    label: "",
    amount: "",
    status: "",
    channel: "",
  });

  if (permissionResponse?.status != "granted") {
    requestPermision();
  }

  async function saveImage() {
    const localUri = await containerRef.current?.capture();
    const assets = await MediaLibrary.createAssetAsync(localUri);
    const savedImage = await MediaLibrary.createAlbumAsync(
      "Screenshots",
      assets,
      false
    );

    if (savedImage) {
      Toast.show("Imaged saved to device", Toast.LONG);
    }
  }

  useEffect(() => {
    async function fetch_data() {
      setIsLoading(true);
      const token = await getToken();
      try {
        const req = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/transaction/one/${Number(
            id
          )}`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await req.json();
        if (res.success) {
          return setTransaction(res.transaction);
        }
        Toast.show("Unknown server error", Toast.LONG);
      } catch (error) {
        Toast.show("unexpected error occured", Toast.LONG);
      }finally {
        setIsLoading(false)
      }
    }
    fetch_data();
  }, []);

  useEffect(() => {
    switch (transaction.status) {
      case "successful":
        setSrc(require("@/assets/images/icons/success.png"));
        break;
      case "pending":
        setSrc(require("@/assets/images/icons/pending.png"));
        break;
      case "successful":
        setSrc(require("@/assets/images/icons/failed.png"));
        break;

      default:
        setSrc(null)
        break;
    }
  }, [transaction.status]);

  return (
    <View className="dark:bg-bgDark bg-bgLight flex-1 px-3 justify-center">
      <ViewShot ref={containerRef} options={{ format: "jpg", quality: 1 }}>
        <View className="dark:bg-dark bg-light px-5 py-10 ">
          <View>
            <View style={{ alignItems: "center", marginBottom: 40 }}>
              <Image
                source={src}
                style={{ width: 80, height: 80, marginBottom: 12 }}
              />
              <Text className="dark:text-light text-xl font-semibold capitalize">
                {transaction.type}
              </Text>
            </View>
            <View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="dark:text-textLight text-textDark text-lg flex-1 italic">
                  Label
                </Text>
                <Text
                  className="dark:text-textLight text-textDark text-lg flex-1 text-right capitalize"
                  style={{ lineHeight: 16 }}
                >
                  {transaction.label}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="dark:text-textLight text-textDark text-lg flex-1 italic">
                  Amount
                </Text>
                <Text className="dark:text-light text-dark text-lg flex-1 text-right">
                  {Currency(Number(transaction.amount))}
                </Text>
              </View>
              <View className="flex-row justify-between items-center mb-4">
                <Text className="dark:text-textLight text-textDark text-lg flex-1 italic">
                  Channel
                </Text>
                <Text
                  className="dark:text-textLight text-textDark text-lg flex-1 text-right uppercase"
                  style={{ lineHeight: 16 }}
                >
                  {transaction.channel}
                </Text>
              </View>
              <View className="flex-row justify-between items-center">
                <Text className="dark:text-textLight text-textDark text-lg flex-1 italic">
                  Date
                </Text>
                <Text className="dark:text-light text-dark text-lg flex-1 text-right">
                  {transaction.createdAt && !isNaN(new Date(transaction.createdAt).getTime())
                    ? new Date(transaction.createdAt).toLocaleString()
                    : ""}
                </Text>
              </View>
            </View>
          </View>

          <View className="mt-14 ">
            <TouchableOpacity
              onPress={() => saveImage()}
              className="dark:bg-slate-800 bg-slate-100 py-4 rounded-lg"
            >
              <Text className="dark:text-light text-center font-semibold">
                Save
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ViewShot>

      {isLoading && <LoaderScreen />}
    </View>
  );
};

export default TransactionDetails;
