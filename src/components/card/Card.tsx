import { useState, useEffect, ReactElement } from "react";
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
import { CardType, CountryType } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import { getCard, getCountryData } from "../../global/Global";

const Card = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<CountryType>();
    const [selectedCard, setSelectedCard] = useState<CardType>();
    const [cardComponent, setCardComponent] = useState<ReactElement>()
    const { country, card } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        getCountryData(country, setSelectedCountry, setIsLoading)
        getCard(selectedCountry, card, setSelectedCard)
    }, [country, card]);

    useEffect(() => {
        const timer = setTimeout(() => {
            setSelectedCard(selectedCard);
            // add the proper card component
            switch (selectedCard?.title) {
                case "Emergency Numbers":
                    setCardComponent(<EmergencyContacts emergencyContacts={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Cities With LCs":
                    setCardComponent(<CitiesWithLcs cities={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "General Information":
                    setCardComponent(<GeneralInfo information={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Fun Facts":
                    setCardComponent(<FunFacts facts={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Recommended Places":
                    setCardComponent(<Places places={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Other Information":
                    setCardComponent(<Other other={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Traditional Cuisine":
                    setCardComponent(<Cuisine cuisine={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Transportation":
                    setCardComponent(<Transport transport={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                case "Summer Reception":
                    setCardComponent(<SummerReception summerReception={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
                default:
                    setCardComponent(<Gallery images={selectedCard?.content ?? []} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleBack={handleBack} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange}/>)
                    break
            }

            setIsLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, [selectedCountry, selectedCard]);

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
                navigate(`/${country}`)
            }
        } else navigate(`/${country}`)
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
                            <CardHeader country={selectedCountry?.name ?? ""} card={card} imgSrc={selectedCountry?.imageSrc}/>

                            {cardComponent}

                        </div>
                    </div>
                </section>
            )}
        </section>
    )

}

export default Card;