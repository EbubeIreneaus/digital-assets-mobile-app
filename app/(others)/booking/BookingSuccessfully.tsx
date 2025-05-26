import useAppTheme from "@/lib/appTheme";
import { MaterialIcons } from "@expo/vector-icons";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity } from "react-native";

const BookingSuccessfully = () => {
  const { textColor } = useAppTheme();
  const { from }: { from: "flight" | "visa" } = useLocalSearchParams();
  return (
    <View className="dark:bg-dark bg-light px-5 py-12 flex-1">
      {from == "flight" && (
        <>
          <MaterialIcons name="flight" size={28} color={textColor} />
          <Text className="text-3xl font-extrabold dark:text-light text-dark my-8">
            Flight Booked Successfully
          </Text>
          <Text className="text-lg dark:text-light text-dark">
            Details of this purchase have been sent to your email. One of our
            Flight Team agents will get in touch as soon as possible.
          </Text>
          <Link asChild href="/">
            <TouchableOpacity className="mt-14">
              <Text className="text-center dark:text-light/60 text-dark/60 font-semibold unde underline-offset-2">
                Back to home
              </Text>
            </TouchableOpacity>
          </Link>
        </>
      )}

      {from == "visa" && (
        <>
          <MaterialIcons name="airplane-ticket" size={28} color={textColor} />
          <Text className="text-3xl font-extrabold dark:text-light text-dark my-8">
            Visa Application Recieved
          </Text>
          <Text className="text-lg dark:text-light text-dark">
            Details of this purchase have been sent to your email. One of our
            Flight Team agents will get in touch as soon as possible.
          </Text>
          <Link asChild href="/">
            <TouchableOpacity className="mt-14">
              <Text className="text-center dark:text-light/60 text-dark/60 font-semibold unde underline-offset-2">
                Back to home
              </Text>
            </TouchableOpacity>
          </Link>
        </>
      )}
    </View>
  );
};

export default BookingSuccessfully;
