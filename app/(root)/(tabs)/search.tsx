import FilterModal from '@/components/FilterModal'
import PropertyCard from '@/components/PropertyCard'
import { supabase } from '@/lib/supabase'
import { formatPrice } from '@/lib/utils'
import { useFilterStore } from '@/store/filterStore'
import { Property } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { ActivityIndicator, FlatList, Text, TextInput, TouchableOpacity, View } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'

export default function Search() {
  const [results, setResults] = useState<Property[]>([]);
  const [loading, setLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const { openFilters } = useLocalSearchParams<{openFilters?:string}>();

  useEffect(()=>{
    if(openFilters === "true"){
      setShowFilters(true);
    }
  },[openFilters]);

  const {
    search,
    MaxPrice,
    bedrooms,
    minPrice,
    setBedrooms,
    setMaxPrice,
    setMinPrice,
    setSearch,
    setType,
    type
  } = useFilterStore();

  const activeFilterCounts = [
    type !== null,
    bedrooms !== null,
    minPrice !== null,
    MaxPrice !== null,
  ].filter(Boolean).length

  useEffect(()=>{
    const debounceTimer = setTimeout(()=>{
      fetchData();
    },500);
    return ()=>clearTimeout(debounceTimer);
  },[search,type,bedrooms,minPrice,MaxPrice])

  const fetchData = async()=>{
    try {
      setLoading(true);
      let query = supabase.from('properties').select("*");
      if(search){
        query=query.or(`
          title.ilike.%${search}%,
          city.ilike%${search}%,
  
        `);
      }
      if(type){
        query=query.eq('type', type);
      }
      if(bedrooms){
        query=query.eq('bedrooms',bedrooms);
      }
      if(minPrice){
        query=query.gte('price',minPrice)
      }
      if(MaxPrice){
        query=query.lte('price',MaxPrice);
      }
  
      const {data} = await query.order('created_at',{
        ascending:true
      });
  
      setResults(data ?? []);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  return (
   <SafeAreaView className='flex-1 bg-gray-50'>
      <View className='px-5 pt-4 pb-3'>
        <Text className='text-2xl font-bold text-gray-900 mb-4'>
          Find Property
        </Text>
        
        <View className='flex-row items-center gap-3'>
          <View 
          className='flex-1 flex-row gap-3 items-center bg-white rounded-2xl px-4'
          style={{
              shadowColor:"#000",
              shadowOffset:{width:0,height:1},
              shadowOpacity:0.06,
              shadowRadius:6,
              elevation:2
            }}
          >
            <Ionicons name='search-outline' color='#9CA3AF' size={18}/>
            <TextInput
            className='flex-1 py-3 text-gray-500'
            placeholder='Search by title or city...'
            value={search}
            onChangeText={setSearch}
            autoCapitalize='none'
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={()=>setSearch("")}>
                <Ionicons name='close-circle' color='#9CA3AF' size={18}/>
              </TouchableOpacity>
            )}
          </View>
          <TouchableOpacity 
          onPress={()=>setShowFilters(true)}
          className={`w-12 h-12 items-center justify-center rounded-2xl
            ${activeFilterCounts> 0 ? 'bg-blue-600' : 'bg-white' }`}
            style={{
              shadowColor:"#000",
              shadowOffset:{width:0,height:1},
              shadowOpacity:0.06,
              shadowRadius:6,
              elevation:2
            }}
          >
          <Ionicons 
          name='options-outline' 
          color={activeFilterCounts > 0 ? "#fff":"#374151"}
          size={20}
          />
          {activeFilterCounts > 0 && (
            <View className='absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full items-center justify-center'>
              <Text className='text-white font-bold text-[9px]'>
                {activeFilterCounts}
              </Text>
            </View>
          )}
        </TouchableOpacity>
        </View>

        {/* Filter chips  */}
        {activeFilterCounts > 0 && (
          <View className='flex-row flex-wrap gap-2 mt-2'>
            {
              type !== null && (
                <View className='flex-row items-center bg-blue-50 border
                  border-blue-200 rounded-full px-3 py-1 gap-2'
                >
                  <Text className='taxt to-blue-700 text-xs font-semibold capitalize'>
                    {type}
                  </Text>
                  <TouchableOpacity onPress={()=>setType(null)}>
                    <Ionicons name='close' color="1D4ED8" size={11} />
                  </TouchableOpacity>
                </View>
              )
            }
            {bedrooms !== null && (
                <View className='flex-row items-center bg-blue-50 border
                  border-blue-200 rounded-full px-3 py-1 gap-2'
                >
                  <Text className='taxt to-blue-700 text-xs font-semibold capitalize'>
                    {bedrooms=== 4 ? "4+ beds":`${bedrooms} bed${bedrooms > 1 ? "s":""}`}
                  </Text>
                  <TouchableOpacity onPress={()=>setBedrooms(null)}>
                    <Ionicons name='close' color="1D4ED8" size={11} />
                  </TouchableOpacity>
                </View>
              )
            }
            {(minPrice !== null || MaxPrice !== null) && (
                <View className='flex-row items-center bg-blue-50 border
                  border-blue-200 rounded-full px-3 py-1 gap-2'
                >
                  <Text className='taxt to-blue-700 text-xs font-semibold capitalize'>
                    {minPrice && MaxPrice 
                    ? `${formatPrice(minPrice)} - ${formatPrice(MaxPrice)}`
                    :minPrice 
                     ? `From ${formatPrice(minPrice)}`
                     :`Up to ${formatPrice(MaxPrice!)}`}
                  </Text>
                  <TouchableOpacity onPress={()=>{
                    setMinPrice(null);
                    setMaxPrice(null);
                  }}>
                    <Ionicons name='close' color="1D4ED8" size={11} />
                  </TouchableOpacity>
                </View>
              )
            }
          </View>
        )}
      </View>

      {/* Filter Results */}
     <FlatList
        data={results}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <Text className='text-sm mb-4 ml-6 text-gray-400'>
            {loading ? "Searching...":`${results.length} properties found`}
          </Text>
        }
        renderItem={({ item }) => <PropertyCard property={item} />}
        ListEmptyComponent={
          !loading ? (
            <View className='items-center py-10'>
              <Text className='text-gray-400'>
                No Properties found
              </Text>
            </View>
          ):(
            <ActivityIndicator color="#2563EB" size="large" className='py-20'/>
          )
        } 
      />



      {/* Filter Modal */}
      <FilterModal
      visible={showFilters}
      onClose={()=>setShowFilters(false)}
      />
   </SafeAreaView>
    
  )
}

