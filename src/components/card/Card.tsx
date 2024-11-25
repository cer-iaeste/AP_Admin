import React, { useState, useEffect, ReactElement } from "react";
import Loader from "../loader/Loader";
import CardHeader from "./CardHeader";
import "./Card.css"
import EmergencyContacts from "../emergency-contacts/EmergencyContacts";
import CitiesWithLcs from "../committees/CitiesWithLcs";
import GeneralInfo from "../general-info/GeneralInfo";
import FunFacts from "../fun-facts/FunFacts";
import Places from "../recommended-places/Places";
import Other from "../other/Other";
import Cuisine from "../cuisine/Cuisine";
import Transport from "../transport/Transport";
import SummerReception from "../summer-reception/SummerReception";
import Gallery from "../gallery/Gallery";
import { updateCountryField } from "../../service/CountryService";
import { CountryType } from "../../types/types";

interface CardProps {
    selectedCountry: string
    selectedCard: string
    content: any
    selectedCountryImgSrc?: string
    navigateCountry: () => void
}

const Card: React.FC<CardProps> = ({ selectedCountry, selectedCard, content, selectedCountryImgSrc, navigateCountry }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [country, setCountry] = useState("");
    const [card, setCard] = useState("");
    const [cardComponent, setCardComponent] = useState<ReactElement>()

    useEffect(() => {
        const timer = setTimeout(() => {
            setCard(selectedCard);
            setCountry(selectedCountry);
            // add the proper card component
            switch (selectedCard) {
                case "Emergency Numbers":
                    setCardComponent(<EmergencyContacts emergencyContacts={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Cities With LCs":
                    setCardComponent(<CitiesWithLcs cities={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "General Information":
                    setCardComponent(<GeneralInfo information={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Fun Facts":
                    setCardComponent(<FunFacts facts={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Recommended Places":
                    setCardComponent(<Places places={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Other Information":
                    setCardComponent(<Other other={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Traditional Cuisine":
                    setCardComponent(<Cuisine cuisine={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Transportation":
                    setCardComponent(<Transport transport={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Summer Reception":
                    setCardComponent(<SummerReception summerReception={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                default:
                    setCardComponent(<Gallery images={content} country={selectedCountry} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
            }

            setIsLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, [selectedCountry, selectedCard, content]);

    const handleCancel = (setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => {
        setData(structuredClone(data))
        setIsChanged(false); 
    }
    // Save changes (apply the changes and close edit mode)
    const handleSave = (country: string, data: any, column: keyof CountryType, title: string, setIsChanged: (state: boolean) => void) => {
        updateCountryField(country, data, column, title).then(() => {
            setIsChanged(false); // Reset action in progress
        })
    }

    const handleDelete = (index: number, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void, itemIndex?: number): boolean => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            let newData = structuredClone(data)

            if (!itemIndex) newData = newData.filter((_: any, i: number) => i !== index)
            else newData[index].content = newData[index].content.filter((_: any, i: number) => i !== itemIndex);

            setData(newData)
            setIsChanged(true)
            return true
        }
        return false
    }

    const handleBack = (isChanged: boolean, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => {
        if (isChanged) {
            const confirmBack = window.confirm("Are you sure you want to back? All unsaved changes will be lost");
            if (confirmBack) {
                handleCancel(setData, data, setIsChanged)
                navigateCountry()
            }
        } else navigateCountry()
    }

    const handleAddNewItem = (setData: (data: any) => void, data: any, newItem: any, setIsChanged: (state: boolean) => void, index?: number) => {
        if (!index) setData([...data, newItem]);
        else {
            const newData = structuredClone(data)
            newData[index].content = [...newData[index].content, newItem]
            setData(newData)
        }
        setIsChanged(true)
    }

    const handleInputChange = (setData: (data: any) => void, data: any, index: number, value: any, setIsChanged: (state: boolean) => void, column?: string, itemIndex?: number) => {
        const newData = structuredClone(data)
        if (column) {
            if (itemIndex) newData[index].content[itemIndex][column] = value
            else newData[index][column] = value
        }
        else newData[index] = value
        setData(newData)
        setIsChanged(true)
    }
    

    return (
        <section className="section">
            {isLoading ? (
                <Loader />
            ) : (
                <section className="p-1 bg-sky-100">
                    <div className="container">
                        <div className="elements-position">
                            <CardHeader country={country} card={card} imgSrc={selectedCountryImgSrc}/>

                            {cardComponent}

                        </div>
                    </div>
                </section>
            )}
        </section>
    )

}

export default Card;