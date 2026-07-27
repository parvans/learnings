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
import useSavedProperty from "@/hooks/useSavedProperty";
import { formatPrice } from "@/lib/utils";
import {WebView} from "react-native-webview";

const {width}=Dimensions.get("window")
export default function PropertyDetails() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const { userId } = useAuth();
  const router = useRouter();
  const isAdmin = useUserStore((state) => state.isAdmin);

  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  const [expanded, setExpanded] = useState(false);
  const [imageViewVisible, setImageViewVisible] = useState(false);

  const authSupabase = useSupabase();
  const {isSaved, saveLoading, toggleSave} = useSavedProperty(id ?? "");

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

  if(!property){
    return(
      <View className="flex-1 items-center justify-center bg-white">
      <Text>Property Not Found</Text>
    </View>)
  }

  const mapURL = `https://www.openstreetmap.org/export/embed.html?bbox=${
    property.longitude - 0.003 
  }%2C${property.latitude - 0.003}
  %2C${property.longitude + 0.003}
  %2C${property.latitude + 0.003}&layer=mapnik&marker=${property.latitude}
  %2C${property.longitude}`;

  const longDesc = (property?.description?.length ?? 0) > 150;
  const displayDesc = 
  expanded ||!longDesc 
  ? property?.description
  : property?.description.slice(0,150)+"..."
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
              onPress={toggleSave}
              disabled={saveLoading}
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
        </View>
        <View className="px-5 pt-5 pb-8 " style={{opacity:property.is_sold ? 0.6 : 1}}>
          {/* chips */}
          <View className="flex-row gap-2 mb-3 flex-wrap">

            <View className="bg-blue-50 px-3 py-1 rounded-full">
              <Text className="text-blue-600 text-xs capitalize font-semibold">
                {property.type}
                </Text>
            </View>

            {property.is_featured && (
              <View className="bg-amber-50 px-3 flex-row gap-1 items-center py-1 rounded-full">
                <Ionicons name='star' color='#FFE400' size={18}/>
                <Text className="font-semibold text-amber-600 text-xs">
                  Featured
                </Text>
              </View>
            )}
            {property.is_sold && (
              <View className="bg-red-50 px-3 py-1 items-center justify-center rounded-full">
                <Text className="font-semibold text-red-600 text-xs">
                  Featured
                </Text>
              </View>
            )}
          </View>

          <Text className="text-2xl font-bold text-gray-900 mb-1">
            {property.title}
          </Text>
          <Text className="text-xl font-bold text-blue-600 mb-4">
            {formatPrice(property.price)}
          </Text>

          {/* property items */}
          <View className="flex-row justify-between bg-gray-50 rounded-2xl p-4 mb-4">
            <SpecItem
            icon="bed-outline"
            label="Beds"
            value={String(property.bedrooms)}
            />
            <SpecItem
            icon="water-outline"
            label="Baths"
            value={String(property.bathrooms)}
            />
            <SpecItem
            icon="expand-outline"
            label="Area"
            value={`${property.area_sqft} ft²`}
            />
            <SpecItem
            icon="home-outline"
            label="Type"
            value={`${property.type}`}
            />
          </View>

          <Text className="text-base font-bold text-gray-900 mb-2">
            Description
          </Text>
          <Text className="text-sm text-gray-500 leading-6 mb-1">
            {displayDesc}
          </Text>
          {longDesc && (
            <TouchableOpacity onPress={()=>setExpanded(!expanded)}>
              <Text className="text-blue-600 text-sm font-medium mb-5">
                {expanded ? "Show less" : "Read more"}
              </Text>
            </TouchableOpacity>
          )}

          <Text className="text-base font-bold text-gray-900 mb-2 mt-5">
            Location
          </Text>
          <View className="flex-row gap-2 items-center mb-2">
            <Ionicons name="location-outline" size={16} color={"#6B7280"}/>
            <Text className="text-sm text-gray-500 flex-1">
              {property.address}, {property.city}
            </Text>
          </View>

          <TouchableOpacity
          activeOpacity={0.9}
          className="rounded-2xl overflow-hidden mb-6"
          style={{height:200}}
          onPress={()=>{
            router.push({
              pathname:"/(root)/property/map",
              params:{
                latitude:property.latitude,
                longitude:property.longitude,
                title:property.title,
                address:`${property.address}, ${property.city}`
              }
            })
          }}  
          >
            <WebView
             source={{uri:mapURL}}
             style={{flex:1}}
             scrollEnabled={false}
             pointerEvents="none"
            />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}

function SpecItem({
  icon,
  label,
  value
}:{
  icon:keyof typeof Ionicons.glyphMap;
  label:string;
  value:string;
}){
  return(
    <View className="items-center gap-1">
      <Ionicons name={icon} size={20} color={"#2563EB"}/>
      <Text className="text-gray-900 font-bold text-sm">{value}</Text>
      <Text className="text-gray-400 font-bold text-xs">{label}</Text>
    </View>
  )
}
