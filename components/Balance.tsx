import React from "react";
import Currency from "@/lib/currency";
import { Text } from "react-native";

type BalanceProps = {
  amount: number;
  hide?: boolean;
  size?: 'small' | 'medium' | 'large';
};
const Balance = ({ amount, hide, size }: BalanceProps) => {
  let fontSize = 30; // default size
  if (size === 'small') fontSize = 20;
  else if (size === 'large') fontSize = 40;
  return (
    <Text className="dark:text-light font-extrabold" style={{
        fontSize: fontSize,
        fontWeight: "bold",
    }}>{hide? '****': Currency(amount)}</Text>
  );
};

export default Balance;
