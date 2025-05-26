import useAppTheme from "@/lib/appTheme";
import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  Image,
  Dimensions,
} from "react-native";
import { COUNTRIES } from "@/lib/countryList";
import DateTimePicker from "@react-native-community/datetimepicker";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { MaterialIcons } from "@expo/vector-icons";
import { CameraType, useCameraPermissions, CameraView } from "expo-camera";
import Toast from "react-native-simple-toast";
import z from "zod";
import { getToken } from "@/lib/authToken";
import { router } from "expo-router";

const screenHeight = Dimensions.get("window").height;

const Tier2Verification = () => {
  const { primaryColor, textColor, bgColor } = useAppTheme();
  const [cameraPermision, requestCameraPermision] = useCameraPermissions();
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [date, setDate] = useState<null | Date>(null);
  const [selfie, setSelfie] = useState<null | string>(null);
  const [view, setView] = useState(1);
  const cameraRef = useRef<CameraView | null>(null);
  const [error, setError] = useState<null | string>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [data, setData] = useState({
    firstname: "",
    lastname: "",
    middlename: "",
    dob: "",
    address: "",
    city: "",
    postal: "",
    country: "",
  });

  function updateData(key: keyof typeof data, val: string) {
    setError(null);
    return setData({ ...data, [key]: val });
  }

  function dateChange(event: any, date: Date | null) {
    if (event.type === "set" && date) {
      updateData("dob", date?.toISOString().split("T")[0]);
    }
    setShowDatePicker(false);
  }

  if (!cameraPermision?.granted) {
    requestCameraPermision();
  }

  async function takPicture() {
    try {
      const result = await cameraRef.current?.takePictureAsync();
      if (result) {
        setSelfie(result.uri);
      }
    } catch (error) {
      Toast.show("unexpected error occured", Toast.LONG);
    }
  }

  async function validateView1() {
    try {
      const { error, data: value } = await UserDetailsSchema.safeParseAsync(
        data
      );
      if (error) {
        return setError(error.issues[0].message);
      }
      setData(value);
      setView(2);
    } catch (error) {}
  }

  async function submit() {
    setError(null);
    setView(1);
    setIsLoading(true);
    const token = await getToken();
    try {
      const formData = new FormData();
      formData.append("selfie", {
        uri: selfie,
        name: `${data.firstname}-${data.lastname}-${
          data.middlename
        }-selfie-${new Date().getTime()}.jpg`,
        type: "image/jpeg",
      } as any);
      Object.keys(data).forEach((key) =>
        formData.append(key, data[key as keyof typeof data])
      );
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/tier2/`,
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const res = await req.json();

      if (res.success) {
        Toast.show("request submited successfully", Toast.LONG);
        router.replace("/setting");
      }
      setError(res.msg);
    } catch (error) {
      setError("unexpected error occurred");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <ScrollView className="flex-1 dark:bg-bgDark bg-bgLight p-3">
      {view == 1 && (
        <View className="dark:bg-dark bg-light rounded-xl py-10 px-3">
          <View>
            <View className="mb-10">
              <Text className="dark:text-light/80 text-dark/80 mb-3">
                Residence Country
              </Text>
              <View className="dark:bg-bgDark bg-bgLight rounded-xl">
                <Picker
                  onValueChange={(val: string) => updateData("country", val)}
                  selectedValue={data.country}
                  style={{ color: textColor }}
                >
                  {COUNTRIES.map((ct) => (
                    <Picker.Item
                      label={ct.name}
                      value={ct.name}
                      key={ct.code}
                    />
                  ))}
                </Picker>
              </View>
            </View>

            <View className="mb-14">
              <View className="flex-row gap-x-3 justify-between items-center mb-10">
                <View className="flex-1">
                  <Text className="dark:text-light/80 text-dark/80 mb-3">
                    Legal Firstname
                  </Text>
                  <InputField
                    placeholder="Firstname"
                    value={data.firstname}
                    onTextChange={(val) => updateData("firstname", val)}
                  />
                </View>

                <View className="flex-1">
                  <Text className="dark:text-light/80 text-dark/80 mb-3">
                    Legal Lastname
                  </Text>
                  <InputField
                    placeholder="Lastname"
                    value={data.lastname}
                    onTextChange={(val) => updateData("lastname", val)}
                  />
                </View>
              </View>

              <View className="flex-row gap-x-3 justify-between items-center">
                <View className="flex-1">
                  <Text className="dark:text-light/80 text-dark/80 mb-3">
                    Legal Middlename
                  </Text>
                  <InputField
                    placeholder="Middlename"
                    value={data.middlename}
                    onTextChange={(val) => updateData("middlename", val)}
                  />
                </View>

                <View className="flex-1">
                  <Text className="dark:text-light/80 text-dark/80 mb-3">
                    Date of Birth
                  </Text>
                  <TouchableOpacity
                    onPress={() => setShowDatePicker(true)}
                    className="dark:bg-bgDark bg-bgLight rounded-xl py-4"
                  >
                    <Text className="text-center dark:text-light">
                      {data.dob
                        ? new Date(data.dob).toDateString()
                        : "Choose Date"}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>

            <View>
              <Text className="dark:text-light text-3xl font-bold mb-8">
                Additional Information
              </Text>
              <View>
                <View className="mb-10">
                  <Text className="dark:text-light/80 text-dark/80 mb-3">
                    Address
                  </Text>
                  <InputField
                    placeholder="Address"
                    onTextChange={(val) => updateData("address", val)}
                    value={data.address}
                  />
                </View>

                <View className="flex-row gap-x-3 justify-between items-center mb-10">
                  <View className="flex-1">
                    <Text className="dark:text-light/80 text-dark/80 mb-3">
                      Postal Code
                    </Text>
                    <InputField
                      placeholder="Postal Code"
                      value={data.postal}
                      onTextChange={(val) => updateData("postal", val)}
                    />
                  </View>

                  <View className="flex-1">
                    <Text className="dark:text-light/80 text-dark/80 mb-3">
                      City
                    </Text>
                    <InputField
                      placeholder="City"
                      value={data.city}
                      onTextChange={(val) => updateData("city", val)}
                    />
                  </View>
                </View>
                <SubmitButtonWrapper
                  label="Proceed to selfie"
                  errorMessage={error}
                  isLoading={isLoading}
                  onSubmit={() => validateView1()}
                />
              </View>
            </View>
          </View>
        </View>
      )}

      {showDatePicker && (
        <DateTimePicker
          mode="date"
          value={new Date("1990-1-1")}
          maximumDate={new Date("2005-01-01")}
          onChange={(ev, date) => dateChange(ev, date as any)}
        />
      )}

      {view == 2 && (
        <View className="dark:bg-dark bg-light rounded-xl px-4 py-10">
          <Text className="dark:text-light text-3xl font-extrabold mb-10">
            Take a selfie
          </Text>
          <View>
            <View className="mb-7">
              <Text className="dark:text-light text-lg font-semibold mb-3">
                Example:
              </Text>
              <Image
                source={require("@/assets/images/extra/selfie.jpg")}
                style={{ width: 130, height: 100 }}
              />
            </View>
            <View className="mb-10">
              <View className="flex-row gap-x-1 items-center mb-2">
                <MaterialIcons
                  name="check"
                  color="green"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold">
                  A selfie of yourself with a neutral expression
                </Text>
              </View>
              <View className="flex-row gap-x-1 items-center pe-3 mb-4">
                <MaterialIcons
                  name="check"
                  color="green"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold ">
                  Make sure your whole face is visible, centered and your eyes
                  are open
                </Text>
              </View>
              <View className="flex-row gap-x-1 items-center pe-3 mb-4">
                <MaterialIcons
                  name="close"
                  color="red"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold ">
                  Do not hide or alter any part of your face
                </Text>
              </View>
              <View className="flex-row gap-x-1 items-center pe-3 ">
                <MaterialIcons
                  name="close"
                  color="red"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold ">
                  Do not crop your Id or use a screenshot of your id
                </Text>
              </View>
            </View>

            <View>
              <Text className="font-bold dark:text-light/80 text-dark/80 text-lg mb-5">
                Filesize must not be greater than 10mb in .jpg/.png/.jpeg format
              </Text>
              <View>
                <TouchableOpacity
                  onPress={() => setView(3)}
                  className="bg-primary/50 py-4  w-[150px] rounded-lg"
                >
                  <Text className="text-light text-center">Proceed</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      )}

      {view == 3 && (
        <>
          {!cameraPermision?.granted ? (
            <View className="min-h-[300px] items-center justify-center">
              <Text className="dark:text-light text-dark text-lg font-bold mb-8">
                {" "}
                Can't access device Camera
              </Text>
              <TouchableOpacity
                onPress={() => requestCameraPermision()}
                className="bg-primary/50 py-4 rounded-lg"
              >
                <Text className="text-center text-light text-lg">
                  Grant Access
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View
              style={{ height: screenHeight - 50 }}
              className="flex-1 justify-center"
            >
              {!selfie && (
                <CameraView
                  facing="front"
                  flash="auto"
                  style={{ height: 400, width: "100%", borderRadius: 10 }}
                  ref={cameraRef}
                ></CameraView>
              )}

              {selfie && (
                <Image
                  source={{ uri: selfie }}
                  style={{ height: 400, width: "100%", borderRadius: 10 }}
                />
              )}

              <View className="py-5 mt-1 flex-row items-center justify-center gap-x-10">
                <TouchableOpacity disabled={selfie ? true : false} className="">
                  <MaterialIcons
                    onPress={() => setSelfie(null)}
                    name="replay"
                    size={40}
                    className="dark:!text-light "
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => takPicture()}
                  className="size-[90] justify-center items-center bg-primary rounded-full border-2 dark:border-bgLight birder-bgDark"
                >
                  <Image
                    source={require("@/assets/images/icon-tr.png")}
                    style={{ width: 40, height: 40 }}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={() => submit()}>
                  <MaterialIcons name="check" size={40} color="green" />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </>
      )}
    </ScrollView>
  );
};

export default Tier2Verification;

type InputProps = {
  placeholder: string;
  onTextChange: (val: string) => void;
  value: string;
};
export function InputField({ placeholder, onTextChange, value }: InputProps) {
  const { textColor } = useAppTheme();
  return (
    <TextInput
      className="dark:bg-bgDark bg-bgLight dark:text-light rounded-xl py-4 px-2"
      placeholder={placeholder}
      onChangeText={(val) => onTextChange(val)}
      value={value}
      placeholderTextColor={textColor}
    />
  );
}

const UserDetailsSchema = z.object({
  firstname: z.string().min(1, { message: "Firstname is required" }),
  lastname: z.string().min(1, { message: "Lastname is required" }),
  middlename: z.string().min(1, { message: "middlename is required" }),
  country: z.string().min(1, { message: "Country is required" }),
  dob: z.coerce.string(),
  address: z.string().min(1, { message: "address is required" }),
  postal: z.string().min(5, { message: "postal is required" }),
  city: z.string().min(1, { message: "City is required" }),
});
