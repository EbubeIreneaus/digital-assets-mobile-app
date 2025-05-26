import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  ScrollView,
} from "react-native";
import DateTimePicker from "@react-native-community/datetimepicker";
import useAppTheme from "@/lib/appTheme";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { Picker } from "@react-native-picker/picker";
import { set, z } from "zod";
import { getToken } from "@/lib/authToken";
import { router } from "expo-router";

export default function FlightBookingForm() {
  const { textColor } = useAppTheme();

  const [formData, setFormData] = useState({
    trip_type: "return",
    from_city: "",
    to_city: "",
    departure_date: new Date(),
    arrival_date: null as any as Date,
    useAvios: false,
    passenger: 1,
    "boarding_class": "economy",
  });

  const [showDeparture, setShowDeparture] = useState(false);
  const [showReturn, setShowReturn] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const updateForm = (key: keyof typeof formData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };

  async function validateForm() {
    setError(null);
    setIsLoading(true);
    const { error, data } = flightBookingSchema.safeParse(formData);
    if (error) {
      setError(error.issues[0].message);
      return false;
    }
    return true;
  }

  async function handleSubmit() {
    const isValid = await validateForm();
    if (!isValid) {
      setIsLoading(false);
      return;
    }
    try {
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/booking/flight`,
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
        return router.replace('/booking/BookingSuccessfully?from=flight')
      }
      setError(res.msg || "Failed to book flight");
    } catch (error) {
      setError(
        "An error occurred while booking the flight. Please try again later.")
    }finally {
      setIsLoading(false)
    }
  }

  return (
    <ScrollView className="dark:bg-bgDark bg-bgLight p-3" style={styles.container}>
      <View className="dark:bg-dark bg-light flex-1 rounded-xl py-8 px-4">
        <Text style={styles.title} className="dark:text-light">
          Book a Flight
        </Text>

        {/* Trip Type */}
        <View style={styles.radioGroup}>
          {["return", "oneway", "multi-city"].map((type) => (
            <TouchableOpacity
              key={type}
              style={styles.radioOption}
              onPress={() => updateForm("trip_type", type)}
            >
              <View style={styles.radioCircle} className="border-primary">
                {formData.trip_type === type && (
                  <View
                    style={[styles.radioDot, { backgroundColor: textColor }]}
                    className="dark:bg-light border-dark"
                  />
                )}
              </View>
              <Text style={styles.radioText} className="dark:text-light">
                {type === "return"
                  ? "Return"
                  : type === "oneway"
                  ? "One Way"
                  : "Multi-city"}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* From */}
        <Text style={styles.label} className="dark:text-light">
          From
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter origin airport"
          value={formData.from_city}
          onChangeText={(text) => updateForm("from_city", text)}
          placeholderTextColor={textColor}
          className="dark:text-light"
        />

        {/* To */}
        <Text style={styles.label} className="dark:text-light">
          To
        </Text>
        <TextInput
          style={styles.input}
          placeholder="Enter destination airport"
          value={formData.to_city}
          onChangeText={(text) => updateForm("to_city", text)}
          placeholderTextColor={textColor}
          className="dark:text-light"
        />

        {/* Departure Date */}
        <Text style={styles.label} className="dark:text-light">
          Departure
        </Text>
        <TouchableOpacity
          onPress={() => setShowDeparture(true)}
          style={styles.datePicker}
        >
          <Text className="dark:text-light">
            {formData.departure_date.toDateString()}
          </Text>
        </TouchableOpacity>
        {showDeparture && (
          <DateTimePicker
            value={formData.departure_date}
            mode="date"
            display="default"
            onChange={(e, date) => {
              setShowDeparture(Platform.OS === "ios");
              if (date) updateForm("departure_date", date);
            }}
          />
        )}

        {/* Return Date */}
        {formData.trip_type === "return" && (
          <>
            <Text style={styles.label} className="dark:text-light">
              Return
            </Text>
            <TouchableOpacity
              onPress={() => setShowReturn(true)}
              style={styles.datePicker}
            >
              <Text className="dark:text-light">
                {formData.arrival_date ? formData.arrival_date.toDateString() : 'Choose Date'}
              </Text>
            </TouchableOpacity>
            {showReturn && (
              <DateTimePicker
                value={formData.arrival_date? formData.arrival_date : new Date()}
                mode="date"
                display="default"
                onChange={(e, date) => {
                  setShowReturn(Platform.OS === "ios");
                  if (date) updateForm("arrival_date", date);
                }}
              />
            )}
          </>
        )}

        {/* Passenger Class */}

        <Text style={styles.label} className="dark:text-light">
          Passenger's
        </Text>
        <TextInput
          style={styles.input}
          placeholder="1"
          value={formData.passenger.toString()}
          onChangeText={(text) => updateForm("passenger", text)}
          placeholderTextColor={textColor}
          className="dark:text-light"
          inputMode="decimal"
        />

        <Text style={styles.label} className="dark:text-light">
          Boarding Class
        </Text>
        <View style={styles.picker}>
          <Picker
            selectedValue={formData.boarding_class}
            onValueChange={(itemValue) =>
              updateForm("boarding_class", itemValue)
            }
            style={{ color: textColor }}
          >
            <Picker.Item label="Economy" value="economy" />
            <Picker.Item label="Business" value="business" />
            <Picker.Item label="First Class" value="first" />
          </Picker>
        </View>

        {/* Book Using Avios */}
        <TouchableOpacity
          onPress={() => updateForm("useAvios", !formData.useAvios)}
          style={styles.checkboxContainer}
          className="mt-5"
        >
          <View className="border-primary" style={styles.checkbox}>
            {formData.useAvios && (
              <View style={[styles.checked, { backgroundColor: textColor }]} />
            )}
          </View>
          <Text className="dark:text-light">Book using Avios</Text>
        </TouchableOpacity>

        {/* Submit */}
        <SubmitButtonWrapper
          errorMessage={error}
          isLoading={isLoading}
          label="Book Flight"
          onSubmit={() => handleSubmit()}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, flex: 1 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  label: { marginBottom: 5, fontWeight: "bold" },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 15,
    marginBottom: 20,
    borderRadius: 6,
  },
  radioGroup: { flexDirection: "row", marginBottom: 20 },
  radioOption: { flexDirection: "row", alignItems: "center", marginRight: 20 },
  radioCircle: {
    height: 18,
    width: 18,
    borderRadius: 10,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 6,
  },
  radioDot: {
    height: 8,
    width: 8,
    borderRadius: 4,
  },
  radioText: { fontSize: 14 },
  datePicker: {
    padding: 12,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 6,
    marginBottom: 15,
  },
  checkboxContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  checked: {
    width: 12,
    height: 12,
  },
  picker: {
    borderColor: "#ccc",
    borderRadius: 6,
    borderWidth: 1,
  },
});

const flightBookingSchema = z.object({
  trip_type: z.enum(["return", "oneway", "multi"]),
  from_city: z.string().min(1, "Origin city is required"),
  to_city: z.string().min(1, "Destination city is required"),
  departure_date: z.date({
    required_error: "Departure date is required",
    invalid_type_error: "Invalid departure date",
  }),
  arrival_date: z
    .date()
    .optional()
    .refine((date) => !date || date instanceof Date, {
      message: "Invalid arrival date",
    }),
  useAvios: z.boolean(),
  passenger: z.coerce.number().min(1, "Number of passengers is required"),
  boarding_class: z.enum(["economy", "business", "first"]),
});
