import { MaterialIcons } from "@expo/vector-icons";
import { Link, router } from "expo-router";
import React from "react";
import { Text, TouchableOpacity, View } from "react-native";

const Tier3VerificationIntro = () => {
  return (
    <View className="flex-1 dark:bg-bgDark bg-bgLight p-3">
      <View className="px-4 py-10 dark:bg-dark bg-light flex-1 rounded-xl">
        <View className="items-center mb-10">
          <MaterialIcons
            name="warning-amber"
            size={38}
            className="dark:bg-bgDark mb-5 bg-light py-4 px-4 !text-amber-500 rounded-full"
          />
          <Text className="dark:text-light text-xl font-semibold">
            Complete Tier 3 identity verification to access the full range of
            digital assets product and services
          </Text>
        </View>

        <View className="mb-20">
          <Text className="dark:text-light text-dark font-extrabold mb-5">
            Requirement
          </Text>
          <View className="flex-row gap-x-5 mb-4">
            <MaterialIcons
              name="perm-identity"
              size={20}
              className="dark:!text-light/50 text-dark/50"
            />
            <Text className="dark:!text-light/50 text-dark/50">
              Goverment-Issued Id
            </Text>
          </View>
        </View>

        <View className="items-center">
          <Link href="/Tier3Verification" asChild>
            <TouchableOpacity className="bg-primary px-20 py-4 rounded-lg ">
              <Text className="dark:text-light">Proceed</Text>
            </TouchableOpacity>
          </Link>

          <TouchableOpacity onPress={() => router.back()} className="mt-8">
            <Text className="dark:text-amber-500">Cancel</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default Tier3VerificationIntro;
