import React from "react";
import { View, Image, Pressable, Text } from "react-native";
import { Link } from "expo-router";
import { MaterialIcons } from "@expo/vector-icons";
import Currency from "@/lib/currency";

type props = {
    type: string
}
const TransactionItem = ({item}: any) => {
  return (
    <View className="mx-3 mb-3">
      <Link href="/" asChild>
        <Pressable className="flex-row justify-between items-center dark:bg-dark bg-light py-4 px-4 rounded-md">
          <View className="flex-row items-center gap-5">
            <View className=" items-center justify-center rounded-full">
              <MaterialIcons name={item.type == 'withdrawal'? 'remove' : 'add-circle'} size={40} color='green'  />
            </View>
            <View>
                <Text className="dark:text-light capitalize">{item.type}</Text>
                <Text className=" text-sm text-primary">10:30 AM</Text>
            </View>
          </View>

          <View>
            <Text className="text-xl font-semibold dark:text-light">{Currency(100)}</Text>
          </View>
        </Pressable>
      </Link>
    </View>
  );
};

export default TransactionItem;
