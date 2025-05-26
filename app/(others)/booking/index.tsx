import useAppTheme from "@/lib/appTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { Modal, View, Text, TouchableOpacity } from "react-native";

const index = () => {
  const { textColor } = useAppTheme();
  ``;
  return (
    <>
      <View className="flex-1 dark:bg-bgDark bg-bgLight justify-end">
        <View className="flex-row justify-center gap-x-10 items-center py-10">
          <Link href="/booking/BuyFlight" asChild className="p-3">
            <TouchableOpacity className="dark:bg-dark items-center bg-light rounded-xl p-5">
              <MaterialIcons
                name="flight-takeoff"
                size={24}
                color={textColor}
                className="mb-3"
              />
              <Text className="text-sm" style={{ color: textColor }}>
                Book Flight
              </Text>
            </TouchableOpacity>
          </Link>

           <Link href="/booking/BuyVisa" asChild className="p-3">
            <TouchableOpacity className="dark:bg-dark items-center bg-light rounded-xl p-5">
              <MaterialIcons
                name="edit-document"
                size={24}
                color={textColor}
                className="mb-3"
              />
              <Text className="text-sm" style={{ color: textColor }}>
                Book Visa
              </Text>
            </TouchableOpacity>
          </Link>

        </View>
      </View>
    </>
  );
};

export default index;
