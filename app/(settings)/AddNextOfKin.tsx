import useAppTheme from "@/lib/appTheme";
import { Picker } from "@react-native-picker/picker";
import React, { useState } from "react";
import { COUNTRIES } from "@/lib/countryList";
import z, { set } from "zod";
import { View, ScrollView, TextInput, Dimensions, Text } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import PinModalComponent from "@/components/PinModalComponent";
import { getToken } from "@/lib/authToken";
import { router } from "expo-router";
import Toast from "react-native-simple-toast";

const screenHeight = Dimensions.get("window").height;
const relationships = [
  "Father",
  "Mother",
  "Sibling",
  "Spouse",
  "Child",
  "Friend",
  "Other",
];

const AddNextOfKin = () => {
  const { textColor } = useAppTheme();
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [authenticate, setAuthenticate] = useState(false);
  const [form, setForm] = useState({
    fullname: "",
    email: "",
    relationship: "spouse",
    phone: "",
    country: "",
    address: "",
  });

  function handleChange(key: keyof typeof form, value: string) {
    setForm((prev) => ({
      ...prev,
      [key]: value,
    }));
  }

  async function validateForm() {
    setError(null);
    const { error, data } = schema.safeParse(form);
    if (error) {
      setError(error.issues[0].message);
      return false;
    }
    setAuthenticate(true);
    return true;
  }

  const submitForm = async () => {
    setError(null);
    setIsLoading(true);
    setAuthenticate(false);
    const token = await getToken();
    try {
      const res = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/next-of-kin`,
        {
          method: "POST",
          body: JSON.stringify(form),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data: any = await res.json();

      if (data.success) {
        Toast.show("Next of kin added successfully", Toast.LONG);
        return router.replace("/NextOfKin");
      }

      return setError(data.msg);
    } catch (error: any) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight p-4">
      <View
        style={{ minHeight: screenHeight - 50 }}
        className="dark:bg-dark bg-light rounded-md px-4 py-8"
      >
        <Input
          placeholder="Fullname"
          onChange={(val) => handleChange("fullname", val)}
          value={form.fullname}
        />
        <Input
          placeholder="Email Address"
          mode="email"
          onChange={(val) => handleChange("email", val)}
          value={form.email}
        />
        <Select
          placeholder="Relationship"
          value={form.relationship}
          onChange={(val) => handleChange("relationship", val)}
          items={relationships.map((r) => ({
            label: r,
            value: r.toLowerCase(),
          }))}
        />
        <Input
          placeholder="Phone Number"
          mode="tel"
          onChange={(val) => handleChange("phone", val)}
          value={form.phone}
        />
        <Select
          value={form.country}
          onChange={(val) => handleChange("country", val)}
          placeholder="Country of residence"
          items={COUNTRIES.map((c) => ({
            label: c.name,
            value: c.name.toLowerCase(),
          }))}
        />
        <Input
          placeholder="Address"
          onChange={(val) => handleChange("address", val)}
          value={form.address}
        />

        <View>
          <View className="bg-amber-500/50 rounded-lg p-4">
            <MaterialIcons name="info" size={24} color={textColor} />
            <Text className="text-sm text-dark dark:text-light capitalize">
              if for for six months you have been inactive on your account and
              failed to respond to messages from the company your next of kin is
              to be contacted as to your way about and if dead and with proper
              death certificate and evidence all assets would be immediately
              transferred to your next of kin
            </Text>
          </View>
        </View>

        <SubmitButtonWrapper
          errorMessage={error}
          isLoading={isLoading}
          label="Save Next of Kin"
          onSubmit={() => validateForm()}
        />
      </View>

      {authenticate && (
        <PinModalComponent
          onClose={() => setAuthenticate(false)}
          isVisible={authenticate}
          onValidate={() => submitForm()}
        />
      )}
    </ScrollView>
  );
};

export default AddNextOfKin;

type InputProps = {
  placeholder: string;
  mode?: "email" | "numeric" | "text" | "url" | "tel" | "search";
  onChange?: (text: string) => void;
  value?: string;
};
export function Input({
  placeholder,
  mode = "text",
  onChange,
  value,
}: InputProps) {
  const { textColor } = useAppTheme();

  return (
    <View className="mb-5">
      <Text className="text-sm font-medium dark:text-light mb-2 px-3">
        {placeholder}
      </Text>
      <TextInput
        className="dark:bg-bgDark bg-bgLight py-5 dark:text-light px-4 rounded-lg"
        inputMode={mode}
        placeholder={placeholder}
        placeholderTextColor={textColor}
        onChangeText={(text) => onChange?.(text)}
        value={value}
      />
    </View>
  );
}

type PickerProps = {
  placeholder: string;
  items?: Array<{ label: string; value: string }>;
  selectedValue?: string;
  onChange?: (value: string) => void;
  value?: string;
};
export function Select({
  placeholder,
  items,
  selectedValue,
  onChange,
  value,
}: PickerProps) {
  const { textColor } = useAppTheme();

  return (
    <View className="mb-5">
      <Text className="text-sm font-medium dark:text-light mb-2 px-3">
        {placeholder}
      </Text>
      <View className="dark:bg-bgDark bg-bgLight dark:text-light px-4 rounded-lg">
        <Picker
          style={{ color: textColor }}
          selectedValue={value}
          onValueChange={(val) => onChange?.(val)}
          dropdownIconColor={textColor}
        >
          {items?.map((item, index) => (
            <Picker.Item key={index} label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    </View>
  );
}

const schema = z.object({
  fullname: z.string().min(1, { message: "Fullname is required" }),
  email: z.string().email({ message: "Invalid email address" }),
  relationship: z.string().min(1, { message: "Relationship is required" }),
  phone: z.string().min(1, { message: "Phone number is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  address: z.string().min(1, { message: "Address is required" }),
});
