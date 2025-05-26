import useAppTheme from "@/lib/appTheme";
import Currency from "@/lib/currency";
import React, { useState } from "react";
import { View, TouchableOpacity, TextInput, Text } from "react-native";

type props = {
  onButtonClick: (val: string) => void;
  onTextChange: (val: string) => void;
  inputValue: string;
};
const AmountSection = ({ onButtonClick, onTextChange, inputValue }: props) => {
  const { textColor } = useAppTheme();

  return (
    <View className="">
      <View>
        <TextInput
          inputMode="numeric"
          placeholder="0.00"
          value={inputValue}
          onChangeText={(val) => onTextChange(val)}
          placeholderTextColor={textColor}
          className="py-4 px-3 dark:bg-slate-800 bg-slate-400 dark:text-light rounded-lg"
        />
      </View>
      <View className="flex-row gap-4 flex-wrap py-5">
        {[100, 200, 500, 1000, 2000, 5000, 10000].map((p) => (
          <TouchableOpacity
            key={p}
            className="py-4 px-6 dark:bg-slate-800 bg-slate-400 rounded-xl"
            onPress={() => onButtonClick(p.toString())}
          >
            <Text className="dark:text-slate-100">{Currency(p)}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

export default AmountSection;
