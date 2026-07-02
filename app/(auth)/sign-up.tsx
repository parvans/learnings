import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useAuth, useSignUp } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

export default function SignUp() {
  const {signUp, errors, fetchStatus} = useSignUp();
  const {isSignedIn} = useAuth();

  const router = useRouter();

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const isLoading = fetchStatus === 'fetching';

  return (
    <ScrollView 
    contentContainerStyle={{flexGrow:1}} 
    className='bg-white'
    keyboardShouldPersistTaps='handled'
    >
      <View className='flex-1 justify-center px-6 py-12'>
        <Image 
        source={require('../../assets/images/kribb.png')} 
        className='w-32 h-16 mb-8'
        resizeMode='contain'
        />
        <Text 
          className='text-3xl font-bold text-gray-800 mb-2'>
          Create Account
        </Text>
        <Text className='text-gray-500 mb-8'>
          Find your perfect home with our app.
        </Text>

        {/* Sign Up Form */}

        <View className='flex-row gap-3 mb-4'>
          <TextInput
           className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
            placeholder='First name'
            placeholderTextColor='#9CA3AF'
            autoCapitalize='words'
            value={firstName}
            onChangeText={setFirstName}
          />
          <TextInput
          className='flex-1 border border-gray-300 rounded-xl px-4 py-3'
            placeholder='Last name'
            placeholderTextColor='#9CA3AF'
            autoCapitalize='words'
            value={lastName}
            onChangeText={setLastName}
          />
        </View>

        <TextInput
        className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
          placeholder='Email'
          placeholderTextColor='#9CA3AF'
          autoCapitalize='none'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />
        {errors.fields.emailAddress && (
          <Text className='text-red-500 mb-4'>
            {errors.fields.emailAddress?.message}
          </Text>
        )}

        <TextInput
          className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-6'
          placeholder='Password'
          placeholderTextColor='#9CA3AF'
          autoCapitalize='none'
          value={password}
          onChangeText={setPassword}
          secureTextEntry
        />
        {errors.fields.password && (
          <Text className='text-red-500 mb-4'>
            {errors.fields.password?.message}
          </Text>
        )}

        <TouchableOpacity 
         className='bg-blue-600 rounded-xl py-3 mb-4 items-center' 
         disabled={isLoading}
         >
          {
            isLoading ? (
              <ActivityIndicator size='small' color='#fff'/>
            ):(
              <Text className='text-white font-bold text-base'>
                Sign Up
              </Text>
            )
          }
        </TouchableOpacity>

        <View className="flex-row justify-center gap-2 mt-2">
          <Text className='text-gray-500'>
            Already have an account?
          </Text>
          <Link href='/sign-in'>
            <Text className='text-blue-600 font-bold ml-1'>
              Sign In
            </Text>
          </Link>
        </View>
      </View>
    </ScrollView>
  )
}