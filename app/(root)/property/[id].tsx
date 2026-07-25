import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { router } from 'expo-router'

export default function PropertyDetails() {
  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
        <View className='px-5 pt-4 pb-3'>
            <Text>PropertyDetails</Text>
            <TouchableOpacity onPress={()=>router.back()}>
                <Text>Go Back</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
  )
}