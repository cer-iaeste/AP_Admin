// src/context/CardContext.ts (or .tsx)
import React from 'react';
import { CountryType } from "../../types/types";

// Define the shape of the context's value
interface CardContextType {
    countryName: string
    handleSave: (country: string, data: any, column: keyof CountryType, title: string) => void
    handleDelete: (index: number, setData: (data: any) => void, data: any, itemIndex?: number) => Promise<boolean>
    handleAddNewItem: (setData: (data: any) => void, data: any, newItem: any, index?: number) => void
    handleInputChange: (setData: (data: any) => void, data: any, originalData: any, index: number, value: any, column?: string, originalColumn?: string, itemIndex?: number) => void
    handleCancel: (setData: (data: any) => void, data: any) => Promise<boolean>
    handleUpload: (event: React.ChangeEvent<HTMLInputElement>, folderName: string, data: any, setData: (data: any) => void, setDataToUpload: (data: any) => void, setDataToDelete?: (data: any) => void) => void
    isChanged: boolean
    setIsChanged: (state: boolean) => void
    isLoading: boolean
    isMobile: boolean
}

// Create the context with an undefined default value
const CardContext = React.createContext<CardContextType | undefined>(undefined);

export default CardContext;