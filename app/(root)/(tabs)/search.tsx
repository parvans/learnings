import FilterModal from '@/components/FilterModal'
import { useFilterStore } from '@/store/filterStore'
import { Property } from '@/types'
import { Ionicons } from '@expo/vector-icons'
import { useLocalSearchParams } from 'expo-router'
import React, { useEffect, useState } from 'react'
import { Text, TextInput, TouchableOpacity, View } from 'react-native'
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
    resetFilter,
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
        {/* <Text>fdfdf</Text>  */}
      </View>

      {/* Results */}

      {/* Filter MOdel */}
      <FilterModal
      visible={showFilters}
      onClose={()=>setShowFilters(false)}
      />
   </SafeAreaView>
    
  )
}

