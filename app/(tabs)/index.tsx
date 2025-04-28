import { Text, View } from "react-native";
import { Redirect, useRouter} from "expo-router";
import { useEffect } from "react";

export default function Index() {

  return (
    <Redirect href="/auth" />
  );
}
