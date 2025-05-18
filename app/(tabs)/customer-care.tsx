import { FontAwesome, MaterialIcons } from '@expo/vector-icons'
import React from 'react'
import { Dimensions, ScrollView, Text, View } from 'react-native'

const screenHeight = Dimensions.get('window').height

const CustomeCare = () => {
  return (
    <ScrollView>
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
                  <MaterialIcons name='phone' className='dark:!text-light' size={30} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Contact Number</Text>
                  <Text className='text-xl font-bold dark:text-light'>+234 806 198 2520</Text>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <MaterialIcons name='email' className='dark:!text-light' size={30} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Email Account</Text>
                  <Text className='text-xl font-bold dark:text-light'>support@digitalassets.com</Text>
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
                  <Text className='text-xl font-bold dark:text-light'>@digitalassets</Text>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <FontAwesome name='instagram' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Instagram</Text>
                  <Text className='text-xl font-bold dark:text-light'>@digitalassets</Text>
                </View>
              </View>

              <View className='flex-row gap-x-5 items-center mb-6'>
                <View className='dark:bg-slate-950/60 p-4 rounded-full'>
                  <FontAwesome name='twitter' className='dark:!text-light' size={25} />
                </View>
                <View>
                  <Text className='dark:text-light text-sm mb-1'>Twitter</Text>
                  <Text className='text-xl font-bold dark:text-light'>@digitalassets</Text>
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
