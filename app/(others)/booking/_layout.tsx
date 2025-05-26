import { Stack } from 'expo-router'
import React from 'react'

const _layout = () => {
  return (
    <Stack>
      <Stack.Screen name="BuyVisa" options={{ headerShown: false }} />
      <Stack.Screen name="BuyFlight" options={{ headerShown: false }} />
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="BookingSuccessfully" options={{ headerShown: false }} />
    </Stack>
  )
}

export default _layout
