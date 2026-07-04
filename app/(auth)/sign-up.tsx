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

  if(signUp.status === "complete" || isSignedIn){
    return null;
  }

  const handleSighUp = async()=>{
    const { error } = await signUp.password({
      emailAddress:email,
      password,
      firstName,
      lastName
    });

    if(error){
      //console.error(JSON.stringify(error, null, 2));
      alert(error.message);
      return;
    }

    if(!error) await signUp.verifications.sendEmailCode();

  };

  const handleVerify = async()=>{
    await signUp.verifications.verifyEmailCode({code});

    if(signUp.status === "complete"){
      await signUp.finalize({
        navigate: ({decorateUrl}) =>{
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
    }
  }

  if(
    signUp.status === "missing_requirements" &&
    signUp.unverifiedFields.includes("email_address") &&
    signUp.missingFields.length === 0
  ){
    return (
      <View className='flex-1 justify-center px-6 py-12'>
        <Image 
        source={require('../../assets/images/kribb.png')} 
        className='w-32 h-16 mb-8'
        resizeMode='contain'
        />
        <Text 
          className='text-3xl font-bold text-gray-800 mb-2'>
          Verify Your Account{" "}
        </Text>
        <Text className='text-gray-500 mb-8'>
          {email}
        </Text>

        {/* Verification Form */}

        <View className='flex-row gap-3 mb-4'>
          <TextInput
           className='w-full border border-gray-300 rounded-xl px-4 py-3'
            placeholder='Enter Verification Code'
            placeholderTextColor='#9CA3AF'
            keyboardType='number-pad'
            value={code}
            onChangeText={setCode}
          />
          {
            errors?.fields?.code && (
              <Text className='text-red-500 mb-4'>
                {errors.fields.code?.message}
              </Text>
            )
          }
        </View>
        <TouchableOpacity 
         className='bg-blue-600 rounded-xl py-3 mb-4 items-center' 
         disabled={isLoading}
         onPress={handleVerify}
         >
          {
            isLoading ? (
              <ActivityIndicator size='small' color='#fff'/>
            ):(
              <Text className='text-white font-bold text-base'>
                Verify
              </Text>
            )
          }
        </TouchableOpacity>

        <TouchableOpacity
        onPress={async () => {
          await signUp.verifications.sendEmailCode();
          setCode('');
        }}
        >
          <Text className='text-blue-600 font-bold text-base'>
            Resend Code
          </Text>
        </TouchableOpacity>
      </View>
    )
  }

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
         onPress={handleSighUp}
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

        <View className="flex-row justify-center mt-2">
          <Text className='text-gray-500'>Already have an account ? </Text>
          <Link href='/sign-in'>
            <Text className='text-blue-600 font-bold ml-1'>
              Sign In
            </Text>
          </Link>
        </View>

        <View nativeID='clerk-captcha'/>
      </View>
    </ScrollView>
  )
}