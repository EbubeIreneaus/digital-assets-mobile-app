import Currency from "@/lib/currency";
import React from "react";
import { Text, View, TouchableOpacity } from "react-native";

type props = {
    investment: {
        plan: string,
        amount: number,
        channel: string,
        progress: "active" | "",
        start_date: string
    }
}

const InvestmentMiniCard = ({ investment }: props) => {
  return (
    <View className=" rounded-bl-xl rounded-br-xl shadow-lg p-4 dark:bg-dark bg-light border-b-8 border-primary">
      {/* Header */}
      <View className="flex flex-row justify-between items-center mb-2">
        <Text className="text-sm font-semibold dark:text-light text-gray-700">
          Investment - <Text className="uppercase">{investment.plan}</Text>
        </Text>
        <Text className="text-xs px-2 py-1 rounded-full text-green-600">
          Approved
        </Text>
      </View>

      {/* Amount */}
      <Text className="text-2xl font-bold dark:text-light text-gray-900 mb-1">{Currency(investment.amount)}</Text>

      {/* Channel */}
      <Text className="text-sm text-gray-500 mb-2">
        Channel: <Text className="font-bold"> {investment.channel}</Text>
      </Text>

      {/* Progress and Date */}
      <View className="flex flex-row justify-between text-xs text-gray-500 mb-4">
        <Text className="text-xs text-gray-500">
          Progress: <Text className="text-green-600 font-semibold capitalize">{investment.progress}</Text>
        </Text>
        <Text className="text-xs text-gray-500">Start: {new Date(investment.start_date).toLocaleDateString()}</Text>
      </View>

      {/* Button */}
      {/* <TouchableOpacity className="mt-3 w-full bg-blue-600 py-2 rounded-lg hover:bg-blue-700">
        <Text className="text-white text-center text-sm font-medium">
          View Details
        </Text>
      </TouchableOpacity> */}
    </View>
  );
};

export default InvestmentMiniCard;
