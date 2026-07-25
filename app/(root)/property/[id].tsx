import { View, Text, TouchableOpacity, ScrollView, FlatList, Image, Dimensions, NativeSyntheticEvent, NativeScrollEvent } from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useAuth } from "@clerk/expo";
import { useUserStore } from "@/store/userStore";
import { Property } from "@/types";
import { useSupabase } from "@/hooks/useSupabase";
import { supabase } from "@/lib/supabase";
import { Ionicons } from "@expo/vector-icons";

const {width}=Dimensions.get("window")
export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expand, setExpand] = useState(false);
  const [imageViewVisible, setImageViewVisible] = useState(false);

  const authSupabase = useSupabase();
  const fetchProperty = async()=>{
    try {
      setLoading(true);
      const{data}=await supabase
      .from('properties')
      .select("*").eq('id',id).single();

      setProperty(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setLoading(false);
    }
  }

  useEffect(()=>{
    fetchProperty();
  },[]);

  const onScroll = (e:NativeSyntheticEvent<NativeScrollEvent>)=>{
    const index = Math.round(e.nativeEvent.contentOffset.x/width)
    setActiveIndex(index)
  }

  const isSaved = false

  if(!property){
    return(
    <View className="flex-1 items-center justify-center bg-white">
      <Text>Property Not Found</Text>
    </View>)
  }
  return (
    <View className="flex-1 bg-white">
      <ScrollView showsVerticalScrollIndicator={false}>
        <View>
          <View style={{opacity:property.is_sold ? 0.5 : 1}}>
            <FlatList
            data={property.images}
            keyExtractor={(_,i)=>i.toString()}
            renderItem={({ item })=>(
              <TouchableOpacity
              onPress={()=>setImageViewVisible(true)}
              >
                <Image 
                source={{ uri: item }} 
                style={{width:width,height:300}}
                />
              </TouchableOpacity>
            )}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            onScroll={onScroll}
            scrollEventThrottle={16}
            />
          </View>
          <View className="absolute bottom-3 right-4
           bg-black/50 px-3 py-1 rounded-full">
            <Text className="text-white text-xs font-medium">
              {activeIndex+1}/{property.images.length}
              </Text>
          </View>
        </View>
        <SafeAreaView className="absolute top-0 left-0 right-0">
          <View className="flex-row items-center justify-between px-4 pt-2">
            <TouchableOpacity 
            onPress={()=>router.back()}
            className="bg-white w-10 h-10 rounded-full 
            items-center justify-center"
            style={{elevation:3}}
            >
              <Ionicons name='arrow-back' color='#111827' size={20}/>
            </TouchableOpacity>
            <TouchableOpacity 
            onPress={()=>router.back()}
            // disabled={}
            className="bg-white w-10 h-10 rounded-full 
            items-center justify-center"
            style={{elevation:3}}
            >
              <Ionicons 
              name={isSaved ? 'heart':'heart-outline'} 
              color={isSaved ? '#EF4444':'#111827'} 
              size={20}
              />
            </TouchableOpacity>
            
          </View>
        </SafeAreaView>
      </ScrollView>
    </View>
  );
}
