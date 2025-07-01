import { useLocalSearchParams } from 'expo-router'
import React from 'react'
import {WebView} from 'react-native-webview'

 const LiveChat = () => {
    const {url}: {url: string} = useLocalSearchParams()
  return (
    <WebView source={{uri: url}}  />
  )
}

export default LiveChat