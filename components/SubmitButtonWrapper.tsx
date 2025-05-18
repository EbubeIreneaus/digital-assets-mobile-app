import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'

type props = {
    errorMessage: string |null
    isLoading: boolean,
    label: string
    onSubmit: () => void
}

const SubmitButtonWrapper = ({errorMessage, isLoading, onSubmit, label}: props) => {
  return (
    
          <View className="mt-10">
            <Text className="mb-3 text-red-500 text-center capitalize font-semibold">{errorMessage?errorMessage:''} </Text>
            <TouchableOpacity onPress={()=> onSubmit()} className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl">
               { isLoading && <FontAwesome name="spinner" size={20} color='white' className="!animat-spin" />}
              <Text className="text-light text-lg font-semibold">{label}</Text>
            </TouchableOpacity>
          </View>
  )
}

export default SubmitButtonWrapper
