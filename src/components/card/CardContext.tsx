// src/context/CardContext.ts (or .tsx)
import React from 'react';
import { CountryType } from "../../types/types";

// Define the shape of the context's value
interface CardContextType {
    countryName: string;
    selectedCardContent: any; // Type 'any' for flexibility, as content varies
    handleSave: (country: string, data: any, column: keyof CountryType, title: string, setIsChanged: (state: boolean) => void) => void;
    handleDelete: (index: number, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void, itemIndex?: number) => Promise<boolean>;
    handleAddNewItem: (setData: (data: any) => void, data: any, newItem: any, setIsChanged: (state: boolean) => void, index?: number) => void;
    handleInputChange: (setData: (data: any) => void, data: any, originalData: any, index: number, value: any, setIsChanged: (state: boolean) => void, column?: string, originalColumn?: string, itemIndex?: number) => void;
    handleCancel: (isChanged: boolean, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => Promise<boolean>;
}

// Create the context with an undefined default value
const CardContext = React.createContext<CardContextType | undefined>(undefined);

export default CardContext;