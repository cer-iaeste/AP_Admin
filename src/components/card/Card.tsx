import React, { useState, useEffect, ReactElement, useCallback } from "react";
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
import Hero from "../hero/Hero";
import { updateCountryField } from "../../service/CountryService";
import { CardType, CountryType, UploadedFileType } from "../../types/types";
import { useParams } from "react-router-dom";
import { getCard, getCountryData, confirmModalWindow, scrollToBottom, isList, getCountryDbName, createUploadFile } from "../../global/Global";
import { toast } from "react-toastify";
import useWindowSize from "../../hooks/useScreenSize";
import CardContext from "./CardContext";

const Card = () => {
    // state handlers
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [isChanged, setIsChanged] = useState<boolean>(false);
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const [minScreenSize, setMinScreenSize] = useState<number>(0)
    const { width, height } = useWindowSize()
    // country & card props
    const [selectedCountry, setSelectedCountry] = useState<CountryType>();
    const [selectedCard, setSelectedCard] = useState<CardType | undefined>();
    const [cardComponent, setCardComponent] = useState<ReactElement | null>(null)
    // get params when page loads
    const { country, card } = useParams()

    useEffect(() => {
        // height - header - footer - margin from footer
        setMinScreenSize(height - 40 - 40 - 50)
    }, [height])

    useEffect(() => {
        setIsMobile(width <= 768)
    }, [width])

    useEffect(() => {
        getCountryData(country, setSelectedCountry, setIsLoading)
    }, [country, card]);

    useEffect(() => {
        if (card && selectedCountry) getCard(selectedCountry, card, setSelectedCard)
    }, [card, selectedCountry])


    // Functions for handling events with cards - these will be provided via Context
    const handleSave = useCallback(
        (country: string, data: any, column: keyof CountryType, title: string) => {
            setIsLoading(true)
            const updatePromise = updateCountryField(country, data, column)
            toast.promise(updatePromise, {
                pending: "Saving changes...",
                success: {
                    render() {
                        setIsChanged(false);
                        return `${title} updated successfully!`;
                    }
                },
                error: "Document not found!"
            })
            setIsLoading(false)
        }, []
    );

    const handleDelete = useCallback(
        async (index: number, setData: (data: any) => void, data: any, itemIndex?: number): Promise<boolean> => {
            const confirmDelete = await confirmModalWindow("Are you sure you want to delete this item?");
            if (!confirmDelete) return false
            if (!data) setData("")
            else {
                let newData = structuredClone(data);
                if (itemIndex === undefined) newData = newData.filter((_: any, i: number) => i !== index);
                else newData[index].content = newData[index].content.filter((_: any, i: number) => i !== itemIndex);
                setData(newData);
            }
            setIsChanged(true);
            return true;
        }, []
    );

    const handleAddNewItem = useCallback(
        (setData: (data: any) => void, data: any, newItem: any, index?: number) => {
            if (index === undefined) setData([...data, newItem]);
            else {
                const newData = structuredClone(data);
                newData[index].content = [...newData[index].content, newItem];
                setData(newData);
            }
            setIsChanged(true);
            scrollToBottom();
        }, []
    );

    const handleInputChange = useCallback(
        (setData: (data: any) => void, data: any, originalData: any, index: number, value: any, column?: string, originalColumn?: string, itemIndex?: number) => {
            const newData = structuredClone(data)
            let change = false
            if (column) {
                if (itemIndex !== undefined) {
                    newData[index].content[itemIndex][column] = value
                    change = value !== originalData[index].content[itemIndex][originalColumn ?? column]
                }
                else {
                    newData[index][column] = value
                    if (originalData.length > index) {
                        change = value !== originalData[index][originalColumn ?? column]
                    } else change = true
                }
            } else {
                newData[index] = value
                change = value !== originalData[index]
            }
            setData(newData);
            setIsChanged(change);
        }, []
    );

    const handleCancel = useCallback(
        async (setData: (data: any) => void, data: any): Promise<boolean> => {
            const handleReset = (): void => {
                setData(structuredClone(data));
                setIsChanged(false);
            };
            if (!isChanged) {
                handleReset();
                return true;
            }
            const confirmation = await confirmModalWindow("All unsaved changes will be lost");
            if (confirmation) handleReset();
            return confirmation;
        }, []
    )


    const handleUpload = (event: React.ChangeEvent<HTMLInputElement>, folderName: string, data: any, setData: (data: any) => void, setDataToUpload: (data: any) => void, setDataToDelete?: (data: any) => void) => {
        const name = getCountryDbName(selectedCountry?.name ?? "")
        const file = event.target.files?.[0]
        if (file) {
            const newFile: UploadedFileType = createUploadFile(file, name, folderName)
            if (!setDataToDelete) {
                setData([...data, newFile.url])
                setDataToUpload([...data, newFile])
            } else {
                setData(newFile.url)
                setDataToUpload(newFile)
                setDataToDelete(data)
            }
            event.target.value = ''
            setIsChanged(true)
        } else toast.error("Error while uploading file!")
    }

    // Memoize the context value to prevent unnecessary re-renders of children
    const contextValue = React.useMemo(() => ({
        countryName: selectedCountry?.name ?? "",
        handleSave,
        handleDelete,
        handleAddNewItem,
        handleInputChange,
        handleCancel,
        handleUpload,
        isChanged,
        setIsChanged,
        isLoading,
        isMobile
    }), [selectedCountry?.name, handleSave, handleDelete, handleAddNewItem, handleInputChange, handleCancel, handleUpload, isChanged, setIsChanged, isLoading, isMobile]);


    useEffect(() => {
        if (!selectedCard || !selectedCountry) { // Ensure both are set before attempting to render specific card
            setCardComponent(null); // Clear component if data is missing
            setIsLoading(true); // Keep loading if data isn't ready
            return;
        }

        const timer = setTimeout(() => {
            // add the proper card component
            switch (selectedCard.title) {
                case "Emergency Numbers":
                    setCardComponent(<EmergencyContacts emergencyContacts={selectedCard.content} />);
                    break;
                case "Cities With LCs":
                    setCardComponent(<CitiesWithLcs cities={selectedCard.content} />);
                    break;
                case "General Information":
                    setCardComponent(<GeneralInfo information={selectedCard.content} />);
                    break;
                case "Social Links":
                    setCardComponent(<SocialLinks socialLinks={selectedCard.content} />);
                    break;
                case "Fun Facts":
                    setCardComponent(<FunFacts facts={selectedCard.content} />);
                    break;
                case "Recommended Places":
                    setCardComponent(<Places places={selectedCard.content} />);
                    break;
                case "Other Information":
                    setCardComponent(<Other other={selectedCard.content} />);
                    break;
                case "Gallery":
                    setCardComponent(<Gallery images={selectedCard.content} />);
                    break;
                case "Traditional Cuisine":
                    setCardComponent(<Cuisine cuisine={selectedCard.content} />);
                    break;
                case "Transportation":
                    setCardComponent(<Transport transport={selectedCard.content} />);
                    break;
                case "Summer Reception":
                    setCardComponent(<SummerReception summerReception={selectedCard.content} />);
                    break;
                default:
                    setCardComponent(<Hero content={selectedCard.content} />);
                    break;
            }
            setIsLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, [selectedCard, selectedCountry]); // Removed `handleCancel` from dependencies since it's removed


    return (
        <section className="section">
            {isLoading ? (
                <Loader />
            ) : (
                <section className="bg-sky-100">
                    <div className="md:elements-position px-4 md:px-12 text-[#1B75BB]" style={{ minHeight: minScreenSize + "px" }}>
                            {/* CardHeader can remain or be refactored to use context for country name */}
                            <CardHeader isChanged={isChanged} country={selectedCountry?.name ?? ""} card={selectedCard} />

                            {/* Provide the context value to all children */}
                            <CardContext.Provider value={contextValue}>
                                {cardComponent}
                            </CardContext.Provider>
                        </div>
                </section>
            )}
        </section>
    );
}

export default Card;
