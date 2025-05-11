import AsyncStorage from "@react-native-async-storage/async-storage";

export async function getToken() {
    let token: any = await AsyncStorage.getItem("token");
    return token;
  }