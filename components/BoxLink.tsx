import React from 'react'
import { Link, RelativePathString, ExternalPathString } from "expo-router";
import { View, Text, Pressable } from 'react-native'
import { MaterialIcons } from '@expo/vector-icons';

type props = {
    title: string,
    icon: keyof typeof MaterialIcons.glyphMap,
    iconColor: string,
    href: string
}

const BoxLink = ({title, icon, href, iconColor}: props) => {
  return (
    <Link href={href as RelativePathString} asChild>
      <Pressable className='justify-center items-center gap-y-2 dark:bg-dark bg-light py-5 w-[23.5%] rounded-md'>
        <MaterialIcons name={icon} size={24} color={iconColor} />
        <Text className='dark:!text-light'>{title}</Text>
      </Pressable>
    </Link>
  )
}

export default BoxLink
