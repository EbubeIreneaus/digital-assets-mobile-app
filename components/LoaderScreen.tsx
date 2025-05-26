import React from 'react'
import { ActivityIndicator, Image, Modal, SafeAreaView, View } from 'react-native'
import { SafeAreaProvider } from 'react-native-safe-area-context'

const LoaderScreen = () => {
  return (
    <SafeAreaProvider>
        <SafeAreaView>
            <Modal animationType='fade' transparent={true} visible={true}>
                <View className="flex-1 justify-center items-center dark:bg-bgDark/50 bg-bgLight/50">
                   <Image
                       source={require('@/assets/images/logo.png')}
                       className="w-20 h-20  animate-bounce"
                   />
                </View>
            </Modal>
        </SafeAreaView>
    </SafeAreaProvider>
  )
}

export default LoaderScreen
