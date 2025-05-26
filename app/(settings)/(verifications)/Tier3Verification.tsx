import { Picker } from "@react-native-picker/picker";
import React, { useRef, useState } from "react";
import { View, Text, TouchableOpacity, Image } from "react-native";
import { COUNTRIES } from "@/lib/countryList";
import useAppTheme from "@/lib/appTheme";
import { MaterialIcons } from "@expo/vector-icons";
import SubmitButtonWrapper from "@/components/SubmitButtonWrapper";
import { CameraView, useCameraPermissions } from "expo-camera";
import Toast from "react-native-simple-toast";
import { getToken } from "@/lib/authToken";
import { router } from "expo-router";

const Tier3Verification = () => {
  const { textColor } = useAppTheme();
  const [cameraPermision, requestCameraPermision] = useCameraPermissions();
  const cameraRef = useRef<CameraView>(null);
  const [view, setView] = useState(1);
  const [uri, setUri] = useState<null | string>(null);
    const [error, setError] = useState<null | string>(null);
    const [isLoading, setIsLoading] = useState(false);
  const [form, setForm] = useState({
    id_type: "card",
    country: "",
  });

  function updateForm(key: keyof typeof form, val: string) {
    setError(null)
    setForm((prev) => ({
      ...prev,
      [key]: val,
    }));
  }

  async function takePicture() {
    try {
      const result = await cameraRef.current?.takePictureAsync();
      if (result) {
        return setUri(result.uri);
      }
      Toast.show("Unexpected error taking image", Toast.LONG);
    } catch (error) {
      Toast.show("Unexpected error taking image", Toast.LONG);
    }
  }

 async function submit() {
    setError(null);
    setView(1);
    setIsLoading(true);
    const token = await getToken();
    try {
      const formData = new FormData();
      formData.append("image", {
        uri: uri,
        name: `${form.id_type}-${new Date().getTime()}.jpg`,
        type: "image/jpeg",
      } as any);
      Object.keys(form).forEach((key) =>
        formData.append(key, form[key as keyof typeof form])
      );
      const req = await fetch(
        `${process.env.EXPO_PUBLIC_API_URL}/api/auth/tier3/`,
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
    <View className="dark:bg-bgDark bg-bgLight  flex-1 p-4">
      <View className="dark:bg-dark bg-light flex-1 rounded-lg p-4">
        {view == 1 && (
          <View>
            <View className="mb-10">
              <Text
                style={{ color: textColor }}
                className="mb-3 font-semibold text-lg"
              >
                Country of Issue
              </Text>
              <View className="dark:bg-gray-700 bg-gray-200 rounded-md mb-8">
                <Picker
                  style={{ color: textColor }}
                  dropdownIconColor={textColor}
                  selectedValue={form.country}
                  onValueChange={(value) => updateForm('country', value)}
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

              <Text className="dark:text-light text-dark text-lg font-bold text-center mb-3">
                Use a valid government-issued identity doucument
              </Text>
              <Text className="dark:text-light/70 text-dark/70 text-lg font-semibold text-center mb-3">
                Only the following document listed below will be accepted, all
                other document will be rejected
              </Text>
            </View>

            <View>
              <CheckBox
                label="Goverment Issue Id Card"
                value="card"
                onClick={(val) => updateForm("id_type", val)}
                checked={form.id_type == "card"}
              />
              <CheckBox
                label="Passport"
                value="passport"
                onClick={(val) => updateForm("id_type", val)}
                checked={form.id_type == "passport"}
              />
              <CheckBox
                label="Driving Licence"
                value="licence"
                onClick={(val) => updateForm("id_type", val)}
                checked={form.id_type == "licence"}
              />
            </View>

            <SubmitButtonWrapper
              label={isLoading? "Please wait.." : 'Proceed'}
              errorMessage={error}
              isLoading={isLoading}
              onSubmit={() => setView(2)}
            />
          </View>
        )}

        {view == 2 && (
          <View className="py-10">
            <View className="mb-10">
              <Text className="dark:text-light/80 text-dark/80 font-extrabold text-4xl mb-7">
                Identity Verification
              </Text>
              <Text className="dark:text-light/80 text-dark/80 font-bold">
                Take a photo of your ID Card
              </Text>
            </View>
            <View className="mb-12">
              <View className="flex-row gap-x-1 items-center mb-3">
                <MaterialIcons
                  name="check"
                  color="green"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold">
                  Goverment Issued
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
                  Original full size, unedited docs
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
                  name="check"
                  color="green"
                  size={28}
                  className=""
                />
                <Text className="dark:text-light/80 text-dark/80 font-bold ">
                  Place document against a single, coloured background
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
                  Readable well lit coloured Image
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
                  No black and white
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
                  No selfie or expired documents
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
                  className="bg-primary/50 py-4  w-[150px] rounded-lg mx-auto mb-7"
                >
                  <Text className="text-light text-center">Proceed</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => setView(1)} className="">
                  <Text className="text-amber-500 text-center">Go back</Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        )}

        {view == 3 && (
          <View className="flex-1 justify-center ">
            {!cameraPermision?.granted && (
              <View className="items-center">
                <Text className="dark:text-light text-dark text-lg font-bold mb-5">
                  This app can't access device camera.
                </Text>
                <TouchableOpacity
                  onPress={() => requestCameraPermision()}
                  className="dark:bg-bgDark bg-bgLight px-10 py-4 rounded-xl"
                >
                  <Text className="dark:text-light text-dark text-lg font-bold">
                    Grant permission
                  </Text>
                </TouchableOpacity>
              </View>
            )}

            {cameraPermision?.granted && (
              <View>
                {!uri && (
                  <CameraView
                    style={{ height: 250, width: "100%", borderRadius: 10 }}
                    ref={cameraRef}
                    facing="back"
                    flash="auto"
                  ></CameraView>
                )}

                {uri && (
                  <Image
                    style={{ height: 250, width: "100%", borderRadius: 10 }}
                    source={{uri}}
                  />
                )}
                <View className="flex-row justify-center items-center gap-x-10 mt-8 mb-14">
                  <TouchableOpacity disabled={uri ? true : false} className="">
                    <MaterialIcons
                      onPress={() => setUri(null)}
                      name="replay"
                      size={40}
                      className="dark:!text-light "
                    />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => takePicture()}
                    className="size-[90] justify-center items-center bg-primary rounded-full border-2 dark:border-bgLight birder-bgDark"
                  >
                    <Image
                      source={require("@/assets/images/icon-tr.png")}
                      style={{ width: 40, height: 40 }}
                    />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={()=> submit()} disabled={uri ? false : true}>
                    <MaterialIcons name="check" size={40} color="green" />
                  </TouchableOpacity>
                </View>

                <TouchableOpacity onPress={() => setView(2)}>
                  <Text className="text-amber-500 text-center font-bold">Go back</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default Tier3Verification;

type CheckBoxProps = {
  label: string;
  value: string;
  onClick: (val: string) => void;
  checked: boolean;
};

export function CheckBox({
  label,
  value,
  onClick,
  checked = false,
}: CheckBoxProps) {
  return (
    <TouchableOpacity
      onPress={() => onClick(value)}
      className="flex-row justify-between items-center px-5 py-8 dark:bg-bgDark bg-bgLight rounded-lg mb-4"
    >
      <Text className="dark:text-light text-dark text-lg font-semibold">
        {label}
      </Text>
      {checked && <MaterialIcons name="check-circle" size={20} color="green" />}
      {!checked && <MaterialIcons name="cancel" size={20} color="red" />}
    </TouchableOpacity>
  );
}
