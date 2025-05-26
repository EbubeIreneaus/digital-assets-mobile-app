import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Platform,
  StyleSheet,
  Dimensions,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import DateTimePicker from "@react-native-community/datetimepicker"; // assume it's similar to your existing button
import { useEffect, useState } from "react";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import Toast from "react-native-simple-toast";
import { getToken } from "@/lib/authToken";
import useAppTheme from "@/lib/appTheme";
import { COUNTRIES } from "@/lib/countryList";
import z from "zod";
import { router } from "expo-router";
// optional for class combination

const screenHeight = Dimensions.get("window").height;
export default function VisaForm() {
  const { textColor } = useAppTheme();
  const [formData, setFormData] = useState({
    nationality: COUNTRIES[0].name,
    visa_type: "tourist",
    country: COUNTRIES[10].name,
    travel_date: new Date(),
    duration: "",
    reason: "",
    confirm: false,
  });

  const [showDate, setShowDate] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key: string, value: any) => {
    setFormData({ ...formData, [key]: value });
  };

  async function validateFormandSubmit() {
    setError("");
    const { error, data } = await schema.safeParseAsync(formData);
    if (error) {
      return setError(error.issues[0].message);
    }
    setFormData(data);
    handleSubmit();
  }

  const handleSubmit = async () => {
    setIsLoading(true);
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/booking/visa`,
        {
          method: "POST",
          body: JSON.stringify(formData),
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${(await getToken()) ?? null}`,
          },
        }
      );
      const res = await req.json();
      if (res.success) {
        return router.replace("/booking/BookingSuccessfully?from=visa");
      }
      setError(res.msg || "Failed to book flight");
    } catch (error) {
      setError(
        "An error occurred while booking the flight. Please try again later."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScrollView className="dark:bg-bgDark bg-bgLight p-4">
      <View
        style={{ minHeight: screenHeight - 50 }}
        className="dark:bg-dark bg-light rounded-xl py-6 px-4 flex-1"
      >
        <Text className="text-xl font-bold mb-10 dark:text-light text-dark">
          Visa Application
        </Text>

        {/* Visa Type */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Visa Type
        </Text>
        <View className="border border-gray-300 dark:border-gray-700 rounded-md mb-8">
          <Picker
            selectedValue={formData.visa_type}
            onValueChange={(value) => updateForm("visa_type", value)}
            style={{ color: textColor }}
            dropdownIconColor={textColor}
          >
            <Picker.Item label="Tourist" value="tourist" />
            <Picker.Item label="Student" value="student" />
            <Picker.Item label="Work" value="work" />
          </Picker>
        </View>

        {/* Country */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Destination Country
        </Text>
        <View className="border border-gray-300 dark:border-gray-700 rounded-md mb-8">
          <Picker
            selectedValue={formData.visa_type}
            onValueChange={(value) => updateForm("country", value)}
            style={{ color: textColor }}
            dropdownIconColor={textColor}
          >
            {COUNTRIES.map((ct) => (
              <Picker.Item label={ct.name} value={ct.name} key={ct.name} />
            ))}
          </Picker>
        </View>

         {/* Country */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Nationality
        </Text>
        <View className="border border-gray-300 dark:border-gray-700 rounded-md mb-8">
          <Picker
            selectedValue={formData.visa_type}
            onValueChange={(value) => updateForm("nationality", value)}
            style={{ color: textColor }}
            dropdownIconColor={textColor}
          >
            {COUNTRIES.map((ct) => (
              <Picker.Item label={ct.name} value={ct.name} key={ct.name} />
            ))}
          </Picker>
        </View>

        {/* Travel Date */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Intended Travel Date
        </Text>
        <TouchableOpacity
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-md mb-8"
          onPress={() => setShowDate(true)}
        >
          <Text className="dark:text-light text-dark">
            {formData.travel_date.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDate && (
          <DateTimePicker
            value={formData.travel_date}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDate(Platform.OS === "ios");
              if (date) updateForm("travel_date", date);
            }}
          />
        )}

        {/* Duration */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Duration (in weeks/months)
        </Text>
        <TextInput
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-md mb-8 dark:text-light text-dark"
          placeholder="e.g. 2 weeks"
          value={formData.duration}
          onChangeText={(text) => updateForm("duration", text)}
          placeholderTextColor={textColor}
        />

        {/* Notes */}
        <Text className="mb-1 font-semibold dark:text-light text-dark">
          Reasons for travel
        </Text>
        <TextInput
          multiline
          className="border border-gray-300 dark:border-gray-700 p-3 rounded-md mb-8 dark:text-light text-dark"
          placeholder="Write any important info here"
          value={formData.reason}
          onChangeText={(text) => updateForm("reason", text)}
          placeholderTextColor={textColor}
        />

        {/* Confirmation */}
        <TouchableOpacity
          className="flex-row items-center mb-6"
          onPress={() => updateForm("confirm", !formData.confirm)}
        >
          <View className="w-5 h-5 border border-primary mr-2 items-center justify-center">
            {formData.confirm && <View className="w-3 h-3 bg-primary" />}
          </View>
          <Text className="dark:text-light text-dark">
            I confirm all details are correct
          </Text>
        </TouchableOpacity>

        {/* Submit */}
        <SubmitButtonWrapper
          errorMessage={error}
          isLoading={isLoading}
          label="Apply for Visa"
          onSubmit={()=> validateFormandSubmit()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({});

const schema = z.object({
  visa_type: z.enum(["work", "student", "tourist"]),
  duration: z.string().min(1, { message: "duration is required" }),
  travel_date: z
    .date()
    .refine((date) => date instanceof Date, {
      message: "enter a valid travel date",
    }),
  confirm: z.boolean().default(false),
  reason: z.string().min(60, { message: "reason must be upto 60 characters" }),
  country: z
    .string()
    .min(1, { message: "please select a valid destination country" }),
  nationality: z
    .string()
    .min(1, { message: "please select a valid nationality" }),
});
