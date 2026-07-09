import { supabase } from '@/lib/supabase';
import { Error, Property } from '@/types';
import { useUser } from '@clerk/expo'
import { useFocusEffect, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react'
import { ActivityIndicator, FlatList, Image, RefreshControl, Text, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Ionicons } from "@expo/vector-icons";
import FeaturedCard from '@/components/FeaturedCard';
import PropertyCard from '@/components/PropertyCard';

export default function HomeScreen() {
  const { user } = useUser();
  const router = useRouter();

  const [featured, setFeatured] = useState<Property[]>([]);
  const [recommended, setRecommended] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error>({state:false,message:''});
  const [refreshing, setRefreshing] = useState(false);

  const fetchProperties = async (isRefreshing = false) => {
  try {
    if (isRefreshing) {
      setRefreshing(true);
    } else {
      setLoading(true);
    }

    setError({
      state: false,
      message: "",
    });

    const [
      { data: featuredData, error: featuredError },
      { data: recommendedData, error: recommendedError },
    ] = await Promise.all([
      supabase
        .from("properties")
        .select("*")
        .eq("is_featured", true)
        .order("created_at", { ascending: false }),

      supabase
        .from("properties")
        .select("*")
        .eq("is_featured", false)
        .order("created_at", { ascending: false }),
    ]);

    if (featuredError || recommendedError) {
      throw featuredError || recommendedError;
    }

    setFeatured(featuredData ?? []);
    setRecommended(recommendedData ?? []);
  } catch (err: any) {
    setError({
      state: true,
      message: err.message,
    });
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  useFocusEffect(
    useCallback(()=>{
      fetchProperties();
    }, [])
  );

  return (
    <SafeAreaView className='flex-1 bg-gray-50'>
      <FlatList
        data={recommended}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View>
            {/* Header */}
            <View className='flex-row items-center justify-between px-5 pt-4 pb-5'>
              <Image
              source={require('../../../assets/images/kribb.png')}
              style={{width:90,height:36}}
              resizeMode='contain'
              />
              <View className='items-end'>
                <Text>Good Morning</Text>
                <Text className='text-gray-900 font-bold text-base'>
                  {user?.firstName ?? 'User'}
                </Text>
              </View>
            </View>

            {/* Search bar */}
            <TouchableOpacity 
            onPress={()=>router.push('/(root)/(tabs)/search')}
            className='mx-5 mb-6 flex-row bg-white items-center rounded-2xl gap-3 px-4 py-3'
            style={{
              shadowColor:"#000",
              shadowOffset:{width:0,height:1},
              shadowOpacity:0.06,
              shadowRadius:6,
              elevation:2
            }}
            >
              <Ionicons name='search-outline' color='#9CA3AF' size={18}/>
              <Text className='text-gray-400 text-sm flex-1'>
                Search properties, cities...
              </Text>
              <TouchableOpacity
              onPress={()=>
                router.push('/(root)/(tabs)/search?openFilters=true')
              }
              className='w-8 h-8 items-center justify-center bg-blue-500 rounded-xl'
              >
                <Ionicons name='options-outline' color='white' size={15}/>
              </TouchableOpacity>
            </TouchableOpacity>

            {/* Featured properties */}
            <View className='mb-6'>
              {error.state ? (
                <Text className='text-red-500 px-5 py-4 text-center'>
                  {error.message}
                </Text>
              ) : null}
              <Text className='text-lg text-gray-900 px-5 font-bold mb-4'>
                Featured
              </Text>
              {loading ? (
                <ActivityIndicator 
                  size='small' 
                  color='#2563EB' 
                  className='py-10'
                />):(
                <FlatList
                data={featured}
                keyExtractor={(item) => item.id}
                horizontal
                contentContainerStyle={{paddingBottom:20}}
                showsHorizontalScrollIndicator={false}
                renderItem={({item})=> <FeaturedCard property={item} />}
                />
              )}
            </View>

            {/* recommended Properties */}
            <Text className='text-lg text-gray-900 px-5 font-bold mb-4'>
              Recommended
            </Text>

          </View>
        }
        renderItem={({ item }) => (
          <PropertyCard 
           property={item}
          />
        )}

        ListEmptyComponent={
          !loading ? (
            <View className='items-center py-10'>
              <Text className='text-gray-400'>
                No Properties found
              </Text>
            </View>
          ):null
        }
        refreshControl={
          <RefreshControl
          refreshing={refreshing}
          onRefresh={() => fetchProperties(true)}
          />
        }
      />
    </SafeAreaView>
  )
}

