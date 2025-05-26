import { FontAwesome } from '@expo/vector-icons'
import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native'
import LoaderScreen from './LoaderScreen'

type props = {
    errorMessage: string |null
    isLoading: boolean,
    label: string,
    disabled?: boolean,
    onSubmit: () => void
}

const SubmitButtonWrapper = ({errorMessage, isLoading, onSubmit, label, disabled=false}: props) => {
  return (
    <>
     <View className="mt-8">
            <Text className="mb-3 text-red-500 text-center capitalize font-semibold">{errorMessage?errorMessage:''} </Text>
            <TouchableOpacity disabled={isLoading || disabled} onPress={()=> onSubmit()} className="bg-primary flex-row justify-center items-center gap-x-5 py-4 rounded-xl">
               { isLoading && <FontAwesome name="spinner" size={20} color='white' className="animate-spin" />}
              <Text className="text-light text-lg font-semibold">{label}</Text>
            </TouchableOpacity>
          </View>
          {isLoading && <LoaderScreen />}
    </>
  )
}

export default SubmitButtonWrapper
