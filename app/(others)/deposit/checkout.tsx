import Currency from "@/lib/currency";
import React, { useEffect, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  Image,
  TouchableOpacity,
  Pressable,
  ToastAndroid,
} from "react-native";
import { router, useLocalSearchParams } from "expo-router";
import * as ImagePicker from 'expo-image-picker'
import { FontAwesome } from "@expo/vector-icons";

const Checkout = () => {
    const [wallet, setWallet] = useState<any>(null)
    const query = useLocalSearchParams()
    const {channel, amount, id}: {channel: string, amount: string, id: string} = query as any
    const [image, setImage] = useState<any>(null)
    const [isLoading, setIsLoading] = useState(false)

    async function openImagePicker (){
        try {
            
            let result = await ImagePicker.launchImageLibraryAsync({
                mediaTypes: ['images'],
                quality: 1,
                allowsEditing: false
            })

            if (!result.canceled) {
                setImage(result.assets[0])
                
            }
        } catch (error) {
            
        }
    }
    async function getWallet(){
        try {
            const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/transaction/channel/${channel}`)
            const res = await req.json()
            if (res.success) {
                setWallet(res.data)
            }
        } catch (error) {
            console.log('error', error)
        }
    }

    async function sendConfirmPayment(){
        try {
            setIsLoading(true)
            const formData = new FormData()
            const file = {
                uri: image?.uri,
                name: image?.fileName,
                type: image?.mimeType
            } as any;
        
            formData.append('file', file);
            formData.append('channel', channel as any)
            formData.append('transactId', id as any)
            formData.append('amount', amount as any)

            const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/transaction/pay_slip`,{
                method: 'post',
                body: formData
            })
            const res = await req.json()
            if (res.status == 'success') {
                alert('We are processing your request and we will get back as soon as possible')
                return router.replace('/deposit')
            }
            console.log('response', res)
            ToastAndroid.show('Unknown error occured', ToastAndroid.LONG)
        } catch (error) {
          ToastAndroid.show('Unknown error occured', ToastAndroid.LONG)
            console.log('error', error)
        } finally {
            setIsLoading(false)
        }
    }

    useEffect(() =>{
      getWallet()
    }, [])
  return (
    <View  className="bg-bgLight dark:bg-bgDark flex-1 justify-center">
      <View className="dark:bg-dark bg-light rounded-xl mx-2 px-8 py-10">
        <Text className="text-2xl dark:text-light mb-10 font-extrabold ">PAYMENT INFORMATION</Text>
        <View className="shadow-inner flex-row gap-x-5 mb-6">
          <Text className="dark:text-light font-semibold text-lg">
            Payment Method:
          </Text>
          <Text className="text-amber-500 text-lg">{channel.toUpperCase()}</Text>
        </View>

        <View className="shadow-inner  flex-row gap-x-5 mb-7">
          <Text className="dark:text-light font-semibold text-lg">Amount:</Text>
          <Text className="text-amber-500 text-lg">{Currency(Number(amount))}</Text>
        </View>

        <View className="mb-10 items-center">
          <Image
            source={{
              uri: process.env.EXPO_PUBLIC_API_URL + wallet?.qrcode_image,
            }}
            style={{ width: 250, height: 250 }}
            className="my-6"
          />
          <View className="flex-row gap-5 flex-wrap">
            <Text className="dark:text-light text-lg">
              {wallet?.wallet_address}
            </Text>
            <TouchableOpacity>
              <Text className="text-primary  font-semibold underline underline-offset-4">
                copy
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <View className="mb-6">
        <Text className="font-extrabold dark:text-light mb-7 text-xl text-center">Send us payment reciept to process your payment</Text>
            <TouchableOpacity onPress={() => openImagePicker()} className="py-4 px-3 border dark:border-light rounded-lg">
                <Text className="text-bold dark:text-light">Choose Photo: {image?.fileName}</Text>
            </TouchableOpacity>
        </View>

        <View>
          <Pressable className="bg-primary py-4 rounded-lg flex-row  justify-center items-center gap-x-3" disabled={!image || isLoading} onPress={() => sendConfirmPayment()} >
            {isLoading && <FontAwesome name="spinner" size={24} className="!animate-spin" color='white'/>}
            <Text className="text-light">I have made my payment</Text>
          </Pressable>
        </View>
      </View>
    </View>
  );
};

export default Checkout;
