import { View, Text, Modal, TouchableOpacity, ScrollView, TextInput } from 'react-native'
import React, { useState } from 'react'
import { PropertyType, useFilterStore } from '@/store/filterStore';
import { Ionicons } from '@expo/vector-icons';

const TYPES: { label: string; value: PropertyType }[] = [
  { label: "All", value: null },
  { label: "Apartment", value: "apartment" },
  { label: "House", value: "house" },
  { label: "Villa", value: "villa" },
  { label: "Studio", value: "studio" },
];

const BEDS = [
  { label: "Any", value: null },
  { label: "1", value: 1 },
  { label: "2", value: 2 },
  { label: "3", value: 3 },
  { label: "4+", value: 4 },
];

const PRICE_PRESETS = [
  { label: "Under ₹50L", min: null, max: 5000000 },
  { label: "₹50L – ₹1Cr", min: 5000000, max: 10000000 },
  { label: "₹1Cr – ₹2Cr", min: 10000000, max: 20000000 },
  { label: "Above ₹2Cr", min: 20000000, max: null },
];

const chip = (active: boolean) =>
  `px-4 py-2 rounded-full border ${
    active ? "bg-blue-600 border-blue-500" : "bg-white border-gray-200"
  }`;

const chipText = (active: boolean) =>
  `text-sm font-semibold ${active ? "text-white" : "text-gray-600"}`;


export default function FilterModal({
    visible, 
    onClose
}:{
    visible:boolean,
    onClose:()=>void
}) {

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

    const [localMin, setLocalMin] = useState(minPrice ? String(minPrice):"");
    const [localMax, setLocalMax] = useState(MaxPrice ? String(MaxPrice):"");

    const activeCount = [type, bedrooms, minPrice, MaxPrice].filter(
        (v)=>v!==null
    ).length;

    const handleApply = ()=>{
        setMinPrice(localMin ? Number(localMin): null);
        setMaxPrice(localMax ? Number(localMax): null);
        onClose();
    }
    const handleReset = ()=>{
        setLocalMin("");
        setLocalMax("");
        resetFilter();
        onClose();
    }

    const shadowStyle={
        shadowColor:"#000",
        shadowOffset:{width:0,height:1},
        shadowOpacity:0.06,
        shadowRadius:6,
        elevation:2
    }

  return (
    <Modal 
    visible={visible}
    animationType='slide'
    presentationStyle='pageSheet'
    onRequestClose={onClose}
    >
        <View className='flex-1 bg-gray-50'>
            <View className='flex-row px-5 pt-6 pb-4 bg-white border-b border-gray-100 items-center justify-between'>
                <TouchableOpacity onPress={onClose}>
                    <Ionicons name='close' color='#374151' size={22}/>
                </TouchableOpacity>
                <Text className='text-lg font-bold text-gray-900'>
                    Filters
                </Text>  
                <TouchableOpacity onPress={handleReset}>
                    <Text className='text-sm font-semibold text-blue-600'>
                        Reset
                    </Text>  
                </TouchableOpacity>
            </View>
            <ScrollView
            className='flex-1'
            contentContainerStyle={{padding:20, paddingBottom:40}}
            showsVerticalScrollIndicator={false}
            >

                <Text 
                className='text-base font-bold text-gray-800 mb-3'
                >
                Property Type
                </Text>
                <View className='flex-row flex-wrap gap-2 mb-6'>
                    {
                        TYPES.map((item)=>(
                            <TouchableOpacity
                            key={String(item.value)}
                            onPress={()=>setType(item.value)}
                            style={shadowStyle}
                            className={chip(type===item.value)}
                            >
                                <Text className={chipText(type===item.value)}>{item.label}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View> 

                <Text 
                className='text-base font-bold text-gray-800 mb-3'
                >
                Bedrooms
                </Text>
                <View className='flex-row flex-wrap gap-2 mb-6'>
                    {
                        BEDS.map((item)=>(
                            <TouchableOpacity
                            key={String(item.value)}
                            onPress={()=>setBedrooms(item.value)}
                            style={shadowStyle}
                            className={`flex-1 items-center py-3
                            rounded-2xl border ${chip(bedrooms===item.value)}`}
                            >
                                <Text className={`text-sm font-bold 
                                ${chipText(bedrooms===item.value)}`}
                                >{item.label}</Text>
                            </TouchableOpacity>
                        ))
                    }
                </View> 

                <Text 
                className='text-base font-bold text-gray-800 mb-3'
                >
                Price Range
                </Text>
                <View className='flex-row gap-3 mb-3'>
                    {[
                        {
                            label:"Min Price",
                            value:localMin,
                            onChange:setLocalMin,
                            placeHolder:"0"
                        },
                        {
                            label:"Max Price",
                            value:localMax,
                            onChange:setLocalMax,
                            placeHolder:"Any"
                        },
                    ].map(({label,value,onChange,placeHolder})=>(
                        <View key={label} className='flex-1'>
                            <Text className='text-xs text-gray-500 mb-1.5 font-medium'>{label}</Text>
                            <View 
                            className='bg-white flex-row gap-3 items-center px-3 
                            rounded-2xl border border-gray-200'
                            style={shadowStyle}
                            >
                            <Text className='text-gray-400 text-sm mr-1'>$</Text>
                                <TextInput
                                className='flex-1 py-3 text-gray-800'
                                keyboardType='numeric'
                                placeholderTextColor="#9CA3AF"
                                placeholder={placeHolder}
                                value={value}
                                onChangeText={onChange}
                                />
                            </View>
                        </View>
                    ))}
                </View>
                <View className='flex-row flex-wrap gap-2 mb-6'>
                    {
                        PRICE_PRESETS.map((p)=>{
                            const active = minPrice === p.min && MaxPrice === p.max;
                            return (
                                <TouchableOpacity
                                key={p.label}
                                onPress={()=>{
                                    setLocalMin(p.min ? String(p.min):"");
                                    setLocalMax(p.max ? String(p.max):"");
                                    setMinPrice(p.min);
                                    setMaxPrice(p.max);
                                }}
                                className={`px-3 py-1.5 rounded-full border
                                    ${active ? "bg-blue-50 border-blue-300" 
                                    : "bg-white border-gray-200"}`
                                }
                                >
                                    <Text>{p.label}</Text>
                                </TouchableOpacity>
                            )
                        })
                    }
                </View> 
            </ScrollView>
            <View className='px-5 pb-8 pt-4 bg-white border-t border-gray-100'>
                <TouchableOpacity
                onPress={handleApply}
                className='bg-blue-600 py-4 rounded-2xl items-center'
                style={shadowStyle}
                >
                    <Text 
                    className='text-white font-bold text-base'
                    >Add Filters {activeCount > 0 ? `(${activeCount})` : ""}</Text>
                </TouchableOpacity>
            </View>
        </View>
    </Modal>
  )
}