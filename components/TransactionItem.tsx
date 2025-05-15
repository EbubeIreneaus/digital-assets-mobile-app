import React from "react";
import { View, Image, Pressable, Text, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Currency from "@/lib/currency";

type props = {
    type: string,
    label: string
}
const TransactionItem = ({item}: any) => {
  return (
    <View className="mx-3 mb-3">
      <Link href="/" asChild>
        <TouchableOpacity className="flex-row justify-between items-center dark:bg-dark bg-light py-4 px-4 rounded-md">
          <View className="flex-row items-center gap-5">
            <View className=" items-center justify-center rounded-full">
              {item.type == 'deposit' && <MaterialIcons name="add" size={20} color='green'  />}
              {item.type == 'withdrawal' && <MaterialIcons name="remove" size={20} color='red'  />}
              {(item.type != 'deposit' && item.type != 'withdrawal') && <MaterialIcons name="money" size={20} className="!text-primary" />}
            </View>
            <View>
                <Text className="dark:text-light capitalize line-clamp-1 text-ellipsis">{item.label}</Text>
                <Text className=" text-sm text-primary">{new Date(item.createdAt).toLocaleDateString()}</Text>
            </View>
          </View>

          <View>
            <Text className=" font-semibold dark:text-light text-right">{Currency(Number(item.amount))}</Text>
            <Text className="text-sm text-green-200 px-1">sucessful</Text>
          </View>
        </TouchableOpacity>
      </Link>
    </View>
  );
};

export default TransactionItem;
