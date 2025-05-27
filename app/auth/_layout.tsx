import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar, Text, View } from 'react-native'
import Colors from '@/lib/color'

const AuthLayout = () => {
  return (
     <>
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name='sign-up' options={{headerShown: false}} />
        <Stack.Screen name='sign-in' options={{headerShown: false}} />
        <Stack.Screen name='ResetPasswordVerify' options={{headerShown: false}} />
        <Stack.Screen name='ResetPasswordEmail' options={{headerShown: false}} />
        <Stack.Screen name='otp-verify' options={{
          headerTitle(props) {
            return <Text className='text-xl fornt-extrabold text-light'>OTP Verification</Text>; // Return an empty React fragment or any valid ReactNode
          },
         headerStyle: {
          backgroundColor: Colors.primary
         }
        }} />
      </Stack>
     </>
  ) 
}

export default AuthLayout
