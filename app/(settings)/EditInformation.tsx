import { MaterialIcons } from "@expo/vector-icons";
import { Picker } from "@react-native-picker/picker";
import React, { useEffect, useState } from "react";
import { Dimensions, ScrollView, Text, TextInput, View } from "react-native";
import { COUNTRIES } from "@/lib/countryList";
import useAppTheme from "@/lib/appTheme";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { getToken } from "@/lib/authToken";
import Toast from "react-native-simple-toast";
import { router } from "expo-router";
import LoaderScreen from "@/components/LoaderScreen";

const screenHeight = Dimensions.get("window").height;
const EditInformation = () => {
  const { textColor } = useAppTheme();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fetching, setFetching] = useState(true)
  const [user, setUser] = useState({
    fullname: "",
    email: "",
    phone: "",
    country: "",
  });

  useEffect(() => {
    async function FetchData() {
      const token = await getToken();
      setFetching(true)
      try {
        const req = await fetch(
          `${process.env.EXPO_PUBLIC_API_URL}/api/auth/personal-information`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        const res = await req.json();
        if (res.success) {
          return setUser(res);
        }
        Toast.show("unknown server error", Toast.LONG);
      } catch (error) {
        Toast.show("unexpected error, try again", Toast.LONG);
      }finally{
        setFetching(false)
      }
    }
    FetchData();
  }, []);

  function handleTextChange(key: keyof typeof user, val: string){
    setError(null)
    return setUser({...user, [key]: val})
  }

  async function Update() {
    setIsLoading(true);
    setError(null);
    const token = await getToken();
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/update-personal-information`,
        {
          method: "POST",
          body: JSON.stringify(user),
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        Toast.show("updated successfully", Toast.LONG);
        return router.replace("/setting");
      }
      setError("unknown server error");
    } catch (error) {
      setError("unexpected error, try again");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView className="dark:bg-slate-900 bg-slate-200">
      {fetching && <LoaderScreen />}
      <View style={{ paddingVertical: 40 }} className="px-4">
        <InputField label="fullname" value={user.fullname} onTextChange={(val) => handleTextChange('fullname', val)} />
        <InputField
          label="email"
          value={user.email}
          isVerified={true}
          editable={false}
        />
        <InputField label="phone" value={user.phone} onTextChange={(val) => handleTextChange('phone', val)} />
        <View
          style={{ position: "relative" }}
          className=" dark:bg-slate-950 bg-slate-300 rounded-md mb-8"
        >
          <Text
            style={{ position: "absolute", top: -8 }}
            className="capitalize dark:text-light px-3 dark:bg-slate-950 bg-slate-300 rounded-t-lg"
          >
            Country
          </Text>
          <View className=" px-3">
            <Picker
              className="flex-1"
              mode="dropdown"
              dropdownIconColor="white"
              selectedValue={user.country}
              style={{ color: textColor }}
              onValueChange={(val)=> handleTextChange('country', val)}
            >
              {COUNTRIES.map((ct) => (
                <Picker.Item label={ct.name} value={ct.name} key={ct.name} />
              ))}
            </Picker>
            {/* <MaterialIcons name='edit' size={20} className='dark:!text-light/50' /> */}
          </View>
        </View>

        <SubmitButtonWrapper
          label="Update"
          isLoading={isLoading}
          errorMessage={error}
          onSubmit={() => Update()}
        />
      </View>
    </ScrollView>
  );
};

export default EditInformation;

type inputProps = {
  label: string;
  value: string;
  editable?: boolean;
  isVerified?: boolean;
  onTextChange?: (val: string) => void;
};
export function InputField({
  label,
  value,
  editable = true,
  isVerified = false,
  onTextChange,
}: inputProps) {
  return (
    <View
      style={{ position: "relative" }}
      className=" dark:bg-bgDark bg-bgLight rounded-md mb-8"
    >
      <Text
        style={{ position: "absolute", top: -8 }}
        className="capitalize dark:text-light px-3 dark:bg-slate-950 bg-slate-300 rounded-t-lg"
      >
        {label}
      </Text>
      <View className="flex-row items-center justify-between px-3">
        <TextInput
          className="py-5 dark:text-light flex-1"
          value={value}
          onChangeText={(val) => onTextChange?.(val)}
          editable={editable}
        />
        {editable && (
          <MaterialIcons
            name="edit"
            size={20}
            className="dark:!text-light/50"
          />
        )}
        {isVerified && (
          <MaterialIcons
            name="check-circle"
            size={20}
            className="!text-green-500"
          />
        )}
      </View>
    </View>
  );
}
