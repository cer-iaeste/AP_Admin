import { useState, useEffect, ReactElement, useCallback } from "react";
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
import SocialLinks from "../social-links/SocialLinks"
import { updateCountryField } from "../../service/CountryService";
import { CardType, CountryType } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";
import { getCard, getCountryData, confirmModalWindow, scrollToBottom } from "../../global/Global";
import { toast } from "react-toastify";
import Hero from "../hero/Hero";
import useWindowSize from "../../hooks/useScreenSize";
import CardFooter from "./CardFooter";

const Card = () => {
    // state handlers
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [save, setSave] = useState<boolean>(false)
    const [cardChange, setCardChange] = useState<boolean>(false)
    const [minScreenSize, setMinScreenSize] = useState<number>(0)
    const { height } = useWindowSize()
    const navgation = useNavigate()
    // country & card props
    const [selectedCountry, setSelectedCountry] = useState<CountryType>();
    const [selectedCard, setSelectedCard] = useState<CardType | undefined>();
    const [cardComponent, setCardComponent] = useState<ReactElement>()
    // get params when page loads
    const { country, card } = useParams()

    useEffect(() => {
        // height - header - footer - margin from footer
        setMinScreenSize(height - 40 - 40 - 50)
    }, [height])

    useEffect(() => {
        getCountryData(country, setSelectedCountry, setIsLoading)
        setSave(false)
    }, [country, card]);

    useEffect(() => {
        if (card && selectedCountry) getCard(selectedCountry, card, setSelectedCard)
    }, [card, selectedCountry])



    // fucntions for handling events with cards
    const handleCancel = useCallback(
        async (isChanged: boolean, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void): Promise<boolean> => {
            // local helper function
            const handleReset = (): void => {
                setData(structuredClone(data)); // structuredClone is a global function, no dependency
                setCardChange(false)
            };

            if (!isChanged) {
                handleReset();
                return true;
            }

            const confirmation = await confirmModalWindow("All unsaved changes will be lost");
            if (confirmation) handleReset();
            return confirmation;
        }, []
    );

    const handleSave = (country: string, data: any, column: keyof CountryType, title: string, setIsChanged: (state: boolean) => void) => {

        const updatePromise = updateCountryField(country, data, column)

        toast.promise(updatePromise, {
            pending: "Saving changes...",
            success: {
                render() {
                    setIsChanged(false);
                    return `${title} updated successfully!`
                }
            },
            error: "Document not found!"
        })
    }

    const handleDelete = async (index: number, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void, itemIndex?: number): Promise<boolean> => {
        const confirmDelete = await confirmModalWindow("Are you sure you want to delete this item?")
        if (confirmDelete) {
            let newData = structuredClone(data)

            if (itemIndex === undefined) newData = newData.filter((_: any, i: number) => i !== index)
            else newData[index].content = newData[index].content.filter((_: any, i: number) => i !== itemIndex);

            setData(newData)
            setCardChange(true)
            return true
        }
        return false
    }

    const handleAddNewItem = (setData: (data: any) => void, data: any, newItem: any, setIsChanged: (state: boolean) => void, index?: number) => {
        if (index === undefined) setData([...data, newItem]);
        else {
            const newData = structuredClone(data)
            newData[index].content = [...newData[index].content, newItem]
            setData(newData)
        }
        setCardChange(true)
        scrollToBottom()
    }

    const handleInputChange = (setData: (data: any) => void, data: any, index: number, value: any, setIsChanged: (state: boolean) => void, column?: string, itemIndex?: number) => {
        const newData = structuredClone(data)
        if (column) {
            if (itemIndex !== undefined) newData[index].content[itemIndex][column] = value
            else newData[index][column] = value
        }
        else newData[index] = value
        setData(newData)
        setCardChange(true)
    }

    useEffect(() => {
        if (!selectedCard) return; // Exit early if either value is not yet set

        const timer = setTimeout(() => {
            // add the proper card component
            switch (selectedCard?.title) {
                case "Emergency Numbers":
                    setCardComponent(<EmergencyContacts emergencyContacts={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Cities With LCs":
                    setCardComponent(<CitiesWithLcs cities={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "General Information":
                    setCardComponent(<GeneralInfo information={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Fun Facts":
                    setCardComponent(<FunFacts facts={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Recommended Places":
                    setCardComponent(<Places places={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Other Information":
                    setCardComponent(<Other other={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Traditional Cuisine":
                    setCardComponent(<Cuisine cuisine={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Transportation":
                    setCardComponent(<Transport transport={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Summer Reception":
                    setCardComponent(<SummerReception summerReception={selectedCard.content} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Gallery":
                    setCardComponent(<Gallery images={selectedCard?.content ?? []} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
                case "Social Links":
                    setCardComponent(<SocialLinks socialLinks={selectedCard?.content ?? []} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} save={save} handleChange={setCardChange}/>)
                    break
                default:
                    setCardComponent(<Hero content={selectedCard?.content ?? ""} country={selectedCountry?.name ?? ""} handleSave={handleSave} handleDelete={handleDelete} handleCancel={handleCancel} handleAddNewItem={handleAddNewItem} handleInputChange={handleInputChange} />)
                    break
            }

            setIsLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, [selectedCard, selectedCountry?.name, handleCancel]);


    return (
        <section className="section">
            {isLoading ? (
                <Loader />
            ) : (
                <section className="bg-sky-100">
                    <div className="container">
                        <div className="elements-position px-12 text-[#1B75BB]" style={{ minHeight: minScreenSize + "px" }}>
                            <CardHeader country={selectedCountry?.name ?? ""} card={selectedCard} />
                            {cardComponent}
                        </div>
                    </div>
                </section>
            )}
        </section>
    )

}

export default Card;