import React from "react";
import { View, Text, Image, Pressable, StyleSheet } from "react-native";
import Balance from "./Balance";
import { MaterialIcons } from "@expo/vector-icons";
import { Link } from "expo-router";

const BalanceCard = () => {
  const [isVisible, setIsVisible] = React.useState(true);
  return (
    <View>
      <View className="flex-row justify-between items-center px-5">
        <View>
          <View className="flex-row items-center gap-3 mb-1.5">
            <Image
              source={require("@/assets/images/united-states.png")}
              style={{ width: 20, height: 20 }}
              className=""
            />
            <Text className="dark:text-light">United States Dollars</Text>
          </View>
          <Balance amount={10000} hide={!isVisible} />
          <Text className="dark:text-light text-sm mt-1.5">
            Getting your balance
          </Text>
        </View>

        <View>
          {isVisible ? (
            <Pressable>
              <MaterialIcons
                name="visibility"
                size={25}
                onPress={() => setIsVisible(!isVisible)}
                className="dark:!text-light"
              />
            </Pressable>
          ) : (
            <Pressable>
              <MaterialIcons
                name="visibility-off"
                size={25}
                onPress={() => setIsVisible(!isVisible)}
                className="dark:!text-light"
              />
            </Pressable>
          )}
        </View>
      </View>

      <View className="flex-row justify-between gap-5 my-7 px-5">
        <Link href="/" asChild>
          <Pressable className="dark:bg-dark bg-light rounded-md flex-1 flex-row justify-center items-center gap-2 h-16">
            <MaterialIcons name="attach-money" size={20} className="dark:!text-light" />
            <Text className="dark:text-light dark:bg-dark bg-light">
              Deposit
            </Text>
          </Pressable>
        </Link>

        <Link href="/" asChild>
          <Pressable className="dark:bg-dark bg-light rounded-md flex-1 flex-row justify-center items-center gap-2 h-16">
            <MaterialIcons name="wallet" size={20} className="dark:!text-light" />
            <Text className="dark:text-light dark:bg-dark bg-light">
              Withdraw
            </Text>
          </Pressable>
        </Link>
      </View>

      <View className="dark:bg-dark bg-light py-3 px-4 mx-3 rounded-md flex-row justify-between items-center border-t-4 border-t-primary">
        <Text className="dark:text-light text-sm">Available for spend</Text>
        <Balance amount={3000} hide={!isVisible} size="small" />
      </View>
    </View>
  );
};

export default BalanceCard;

const styles = StyleSheet.create({
  button: {
    height: 50,
  },
});
