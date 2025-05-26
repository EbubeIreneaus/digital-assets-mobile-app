import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";
import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from "react-native";

const Tier2Intro = () => {
  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight p-3">
      <View className="dark:bg-dark bg-light px-5 py-10 rounded-md">
        <View className="flex-row gap-4 mb-10">
          <TouchableOpacity className="bg-primary" style={styles.pillContainer}>
            <Text className="text-light">Tier 2</Text>
          </TouchableOpacity>

          <TouchableOpacity disabled className="bg-primary/30" style={styles.pillContainer}>
            <Text className="text-light">Tier 3</Text>
          </TouchableOpacity>
        </View>
        <View className="mb-10">
          <Text className="dark:text-light text-dark font-extrabold mb-5">
            Requierments
          </Text>
          <View>
            <View className="flex-row gap-x-5 mb-4">
              <MaterialIcons
                name="person"
                size={20}
                className="dark:!text-light/50 text-dark/50"
              />
              <Text className="dark:!text-light/50 text-dark/50">
                Personnal Information
              </Text>
            </View>
            <View className="flex-row gap-x-5 mb-4">
              <MaterialIcons
                name="camera-alt"
                size={20}
                className="dark:!text-light/50 text-dark/50"
              />
              <Text className="dark:!text-light/50 text-dark/50">selfie</Text>
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Text className="dark:text-light text-dark font-extrabold mb-5">
            Features & Limits
          </Text>
          <View className="px-2">
            <View className="flex-row justify-between mb-5">
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                Deposit
              </Text>
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                $50k Daily
              </Text>
            </View>
            <View className="flex-row justify-between mb-4">
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                Withdrawal
              </Text>
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                $50k Daily
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Text className="dark:text-light text-dark font-extrabold mb-5">
            Transaction & Trading Limits
          </Text>
          <View className="px-2">
            <View className="flex-row justify-between mb-5">
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                Trading
              </Text>
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                Unlimited
              </Text>
            </View>
          </View>
        </View>

        <View className="mb-10">
          <Text className="dark:text-light text-dark font-extrabold mb-5">
            Crypto Limit
          </Text>
          <View className="px-2">
            <View className="flex-row justify-between mb-5">
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                Withdraw
              </Text>
              <Text className="dark:!text-light/50 text-dark/50 font-bold">
                $180 BUSD
              </Text>
            </View>
          </View>
        </View>

        <View className="flex-row gap-1 mb-10">
          <MaterialIcons
            name="schedule"
            size={20}
            className="dark:!text-light/50 text-dark/50 font-bold"
          />
          <Text className="dark:!text-light/50 text-dark/50 font-bold">
            {" "}
            Review time: 10 days
          </Text>
        </View>

        <View>
          <Link href="/Tier2Verification" asChild>
            <TouchableOpacity className="bg-primary py-4 rounded-xl">
              <Text className="text-center text-light">Proceed</Text>
            </TouchableOpacity>
          </Link>
        </View>
      </View>
    </ScrollView>
  );
};

export default Tier2Intro;

const styles = StyleSheet.create({
  pillContainer: {
    borderRadius: 20, // Adjust as needed, half of the height
    paddingVertical: 5,
    paddingHorizontal: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  pillText: {
    fontSize: 16,
  },
});
