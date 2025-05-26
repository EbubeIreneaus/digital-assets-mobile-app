import React from 'react'
import { Dimensions, ScrollView, View, Image, Text } from 'react-native'

const screenHeight=Dimensions.get('window').height

const DocumentVerification = () => {
  return (
    <ScrollView className='flex-1 dark:bg-bgDark bg-bgLight p-3'>
      <View style={{minHeight: screenHeight- 50}} className="dark:bg-dark bg-light p-3 rounded-lg">
      
      </View>
    </ScrollView>
  )
}

export default DocumentVerification
