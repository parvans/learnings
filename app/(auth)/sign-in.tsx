import { View, Text } from 'react-native'
import React from 'react'
import { Link } from 'expo-router'

export default function SignIn() {
  return (
    <View className='flex-1 items-center justify-center bg-white'>
      <Text className='text-2xl font-bold'>SignIn</Text>
      <Link href="/sign-up" className='text-blue-500 mt-4'>Don&apos;t have an account? Sign Up</Link>
    </View>
  )
}