import LoaderScreen from "@/components/LoaderScreen";
import useAppTheme from "@/lib/appTheme";
import { getToken } from "@/lib/authToken";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React, { useCallback, useEffect, useState } from "react";
import Toast from "react-native-simple-toast";
import * as Clipboard from 'expo-clipboard'


import {
  ScrollView,
  TouchableOpacity,
  View,
  Text,
  RefreshControl,
  Dimensions,
} from "react-native";

const Invitation = () => {
  const { bgColor, textColor, backgroundColor } = useAppTheme();
  const [refreshing, setRefreshing] = useState(false);
  const screenHeight = Dimensions.get("window").height - 150;
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState<{
    me: { referral_code: string };
    referee: { fullname: string; id: number; has_first_deposit: boolean }[];
    success: boolean;
  } | null>(null);

  async function FetchData() {
    const token = await getToken();
    setIsLoading(true);
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/referral-data`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        return setData(res);
      }
      Toast.show("unknown server error", Toast.LONG);
    } catch (error) {
      Toast.show("unexpected error, try again", Toast.LONG);
    } finally {
      setIsLoading(false);
    }
  }


  const refresh = useCallback(async () => {
    await FetchData()
    setRefreshing(false)
  },[])

  async function copyToClipboard() {
    if (data) {
      await Clipboard.setStringAsync(data.me.referral_code);
      Toast.show("Referral code copied to clipboard", Toast.LONG);
    }
  }

  useEffect(() => {
    FetchData();
  }, []);

  return (
    <ScrollView
      className="flex-1 dark:bg-bgDark bg-bgLight "
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={refresh}
          progressBackgroundColor={bgColor}
          colors={[textColor]}
          tintColor={textColor}
        />
      }
    >
      <View className="flex-1 dark:bg-bgDark bg-bgLight px-5">
        <View
          className=" rounded-lg  py-20 px-2"
          style={{ minHeight: screenHeight }}
        >
          <View className="mb-8 items-center">
            <View>
              <Text
                className="text-5xl font-extrabold mb-5 text-center"
                style={{ color: textColor }}
              >
                Invite Friends to Digital Assets to Earn Rewards
              </Text>
            </View>

            {data && (
              <>
                <View className="py-5 px-3 dark:bg-dark bg-light w-full rounded-lg mt-5">
                  <Text style={{ color: "blue" }} className="text-sm mb-5">
                    Copy & share your referral code
                  </Text>
                  <View className="flex-row justify-between items-center mb-3 px-5">
                    <Text style={{ color: textColor }} className="text-2xl">
                      {data.me.referral_code}
                    </Text>
                    <TouchableOpacity className="dark:bg-bgDark bg-bgLight px-10 py-3 rounded-lg" onPress={copyToClipboard}>
                      <Text style={{ color: textColor }}>Copy </Text>
                    </TouchableOpacity>
                  </View>
                </View>

                <View className="py-5 px-3 dark:bg-dark bg-light w-full rounded-lg mt-5">
                  <Text
                    style={{ color: "blue" }}
                    className="text-sm font-semibold"
                  >
                    Referred By You
                  </Text>
                  {data.referee.length > 0 ? (
                    <>
                      {data.referee.map((item) => (
                        <View key={item.id} className="flex-row justify-between items-center mb-3 px-5 mt-5">
                          <Text
                            style={{ color: textColor }}
                            className="text-lg capitalize"
                          >
                            {item.fullname} 
                          </Text>
                          {
                            item.has_first_deposit?(
                                <MaterialIcons name="check-circle" size={16} color="green" />
                            ):(
                                <MaterialIcons name="disabled-by-default" size={16} color="yellow" />
                            )
                          }
                        </View>
                      ))}
                    </>
                  ) : (
                    <></>
                  )}
                </View>
              </>
            )}
          </View>
        </View>
      </View>

      {isLoading && <LoaderScreen />}
    </ScrollView>
  );
};

export default Invitation;
