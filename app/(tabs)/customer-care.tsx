import useAppTheme from '@/lib/appTheme'
import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React, { useEffect, useState } from 'react'
import { Dimensions, ScrollView, Text, View, Linking, TouchableOpacity, RefreshControl } from 'react-native'
import Toast from 'react-native-simple-toast'

const screenHeight = Dimensions.get('window').height

const CustomeCare = () => {
  const {textColor, bgColor} = useAppTheme()
  const [fetching, setFetching] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  const openUrl = async (url: string, name: string) => {
    if (await Linking.canOpenURL(url)) {
      Linking.openURL(url)
    }else{ 
      Toast.show(`${name} is not installed on this device`, Toast.LONG)
    }
  }

  const [data, setData] = useState({
    phone: '',
    facebook_url: '',
    telegram_url: '',
    twitter_url: ''
  })

  async function fetchData() {
    setFetching(true)
    try {
      const req = await fetch(`${process.env.EXPO_PUBLIC_API_URL}/api/admin/support`)
      const res = await req.json()
      if (res.success) {
        return setData(res.data)
      }
      Toast.show('unknown server error', Toast.LONG)
    } catch (error) {
      Toast.show('unexpected error occured', Toast.LONG)
    } finally {
      setFetching(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  async function onRefresh(){
    await fetchData()
    setRefreshing(false)
  }
  return (
    <ScrollView refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={() => onRefresh()} progressBackgroundColor={bgColor} colors={[textColor]} tintColor={textColor}  />
    }>
      <View style={{minHeight: screenHeight}} className='dark:bg-bgDark bg-bgLight'>
        <View className='bg-primary p-5 mb-10'>
          <Text className='text-light text-lg'>
            You can get in touch with us through the below plartforms. Our Team will reach out to you as soon as it will be possible
          </Text>
        </View>

        <View className='px-5'>

          <View className='p-6 dark:bg-dark bg-light rounded-xl mb-10'>
            <Text className='dark:text-light text-lg font-bold my-6'>Customer Support</Text>
            <View >

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                   <FontAwesome name='whatsapp' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Contact Number</Text>
                  <TouchableOpacity onPress={() => openUrl(`https://wa.me/${data.phone}`, 'Whatsapp')}>
                    <Text className='text-xl font-bold dark:text-light'>{data.phone}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <MaterialIcons name='email' className='dark:!text-light' size={30} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Email Account</Text>
                  <TouchableOpacity onPress={() => openUrl('mailto:support@digitalassetsweb.com', 'Gmail')}>
                  <Text className='text-xl font-bold dark:text-light'>support@digitalassetsweb.com</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>

          <View className='p-6 dark:bg-dark bg-light rounded-xl'>
            <Text className='dark:text-light text-lg font-bold my-6'>Social Media</Text>
            <View >

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 py-4 px-5 rounded-full'>
                  <FontAwesome name='facebook' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Facebook</Text>
                  <TouchableOpacity onPress={() => openUrl(data.facebook_url, 'Facebook')}>
                  <Text className='text-xl font-bold dark:text-light'>Facebook Support</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <FontAwesome name='telegram' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Telegram</Text>
                  <TouchableOpacity onPress={() => openUrl(data.telegram_url, 'Telegram')}>
                  <Text className='text-xl font-bold dark:text-light'>Telegram Support</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <FontAwesome name='whatsapp' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Whatsapp</Text>
                  <TouchableOpacity onPress={() => openUrl(`https://wa.me/${data.phone}`, 'Whatsapp')}>
                  <Text className='text-xl font-bold dark:text-light'>Whatsapp Support</Text>
                  </TouchableOpacity>
                </View>
              </View>

            </View>
          </View>

        </View>
      </View>
    </ScrollView>
  )
}

export default CustomeCare
