import { create } from "zustand";

export type PropertyType = 
'apartment' | 
'house' |
'villa' |
'studio' | null;

interface FilterState {
    search:string;
    type:PropertyType;
    bedrooms:number | null;
    minPrice:number | null;
    MaxPrice:number | null;

    setSearch:(value:string)=>void;
    setType:(value:PropertyType)=>void;
    setBedrooms:(value:number | null)=>void;
    setMinPrice:(value:number | null)=>void;
    setMaxPrice:(value:number | null)=>void;
    resetFilter:()=>void
}

export const  useFilterStore = create<FilterState>((set)=>({
    search: "",
    type:null,
    bedrooms:null,
    minPrice:null,
    MaxPrice:null,
    setSearch: (value) => set({ search: value }),
    setType: (value) => set({ type: value }),
    setBedrooms: (value) => set({ bedrooms: value }),
    setMinPrice: (value) => set({ minPrice: value }),
    setMaxPrice: (value) => set({ MaxPrice: value }),
    resetFilter:()=>
    set({
    search: "",
    type:null,
    bedrooms:null,
    minPrice:null,
    MaxPrice:null,
    })
}));

