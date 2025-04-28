import React from 'react'
import { Stack } from 'expo-router'
import { StatusBar } from 'react-native'
import Colors from '@/lib/color'

const AuthLayout = () => {
  return (
     <>
     <StatusBar barStyle="light-content" backgroundColor={Colors.primary}/>  {/* Added barStyle prop */}
      <Stack>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name='sign-up' options={{headerShown: false}} />
        <Stack.Screen name='sign-in' options={{headerShown: false}} />
      </Stack>
     </>
  ) 
}

export default AuthLayout
