import { View, Text, ScrollView, Image, TextInput, TouchableOpacity, ActivityIndicator } from 'react-native'
import React, { useState } from 'react'
import { useAuth, useSignIn } from '@clerk/expo';
import { Link, useRouter } from 'expo-router';

export default function SignIn() {
  const {signIn, errors, fetchStatus} = useSignIn();

  const router = useRouter();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');

  const isLoading = fetchStatus === 'fetching';

  const handleSignIn = async()=>{
    const { error } = await signIn.password({
      emailAddress:email,
      password
    });

    if(error){
      //console.error(JSON.stringify(error, null, 2));
      alert(error.message);
      return;
    }

    if(signIn.status === "complete"){
      await signIn.finalize({
        navigate: ({session, decorateUrl}) =>{
          if(session.currentTask){
            console.log(session?.currentTask);
            return;
          }
          
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
    }else if(signIn.status === "needs_second_factor"){
      await signIn.mfa.sendPhoneCode();
    }else if(signIn.status === "needs_client_trust"){
      const emailCodeFactor = await signIn.supportedSecondFactors.find(
        (factor) =>factor.strategy === "email_code"
      );

      if(emailCodeFactor){
        await signIn.mfa.sendEmailCode();
      }
    }else{
      console.log("Sign In attempt failed:", signIn);
    }

  };

  const handleVerify = async()=>{
    await signIn.mfa.verifyEmailCode({code});

    if(signIn.status === "complete"){
      await signIn.finalize({
        navigate: ({session, decorateUrl}) =>{
          if(session.currentTask){
            console.log(session?.currentTask);
            return;
          }
          
          const url = decorateUrl("/");
          router.replace(url as any);
        }
      })
    }
  }

  if(signIn?.status === 'needs_client_trust'){
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
          await signIn.emailCode.sendCode();
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
          Welcome Back
        </Text>
        <Text className='text-gray-500 mb-8'>
          Sign in to your account
        </Text>

        {/* Sign In Form */}
        <TextInput
        className='w-full border border-gray-300 rounded-xl px-4 py-3 mb-4'
          placeholder='Email'
          placeholderTextColor='#9CA3AF'
          autoCapitalize='none'
          keyboardType='email-address'
          value={email}
          onChangeText={setEmail}
        />
        {errors.fields.identifier && (
          <Text className='text-red-500 mb-4'>
            {errors.fields.identifier?.message}
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
         onPress={handleSignIn}
         >
          {
            isLoading ? (
              <ActivityIndicator size='small' color='#fff'/>
            ):(
              <Text className='text-white font-bold text-base'>
                Sign In
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