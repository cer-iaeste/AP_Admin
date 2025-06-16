import React, { useState, useEffect, useCallback, useContext } from "react";
import "../card/Card.css";
import { CardFormType, InformationType } from "../../types/types";
import { GENERAL_INFO_CONSTANTS } from "../../global/Global";
import CardForm from "../card/Form";
import CardContext from "../card/CardContext";

interface GeneralInfoProps {
    information: InformationType[]
}

const GeneralInfo: React.FC<GeneralInfoProps> = ({ information }) => {
    const context = useContext(CardContext);
    const [mappedInfoData, setMappedInfoData] = useState<CardFormType[]>([])
    const [infoData, setInfoData] = useState<CardFormType[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    // Memoize the mapping function to avoid unnecessary re-renders
    const mapInfo = useCallback(
        (info: InformationType[]): CardFormType[] =>
            GENERAL_INFO_CONSTANTS.map((item) => {
                const mapItemName = (name: string) => {
                    if (name !== "Country dialing code" && name !== "SIM card providers") return name
                    if (name === "Country dialing code") return "Dialing code"
                    if (name === "SIM card providers") return "SIM providers"
                    return ""
                }

                return {
                    ...item,
                    value: info.find(i => mapItemName(i.name) === item.name)?.role ?? ""
                }
            }),
        []
    );

    // Effect to initialize infoData state when 'information' prop changes
    useEffect(() => {
        setInfoData(mappedInfoData)
    }, [mappedInfoData])

    useEffect(() => {
        setMappedInfoData(mapInfo(information));
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [information, mapInfo]);


    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel } = context;

    // Handlers
    const onSave = () => {
        setIsLoading(true)
        const dataToSave = infoData.map(({ name, value }) => ({ name, role: value })); // Ensure icon is not saved

        try {
            handleSave(countryName, dataToSave, "information", "General information", setIsChanged);
        } catch (error) {
            console.error("Error saving general information:", error);
        } finally {
            setIsLoading(false)
        }
    };

    const onCancel = () => handleCancel(isChanged, setInfoData, mappedInfoData, setIsChanged)

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) =>
        handleInputChange(setInfoData, infoData, information, index, e.target.value, setIsChanged, 'value', 'role');

    return (
        <CardForm items={infoData} onInputChange={onInputChange} isLoading={isLoading} isChanged={isChanged} onSave={onSave} onCancel={onCancel} />
    );
};

export default GeneralInfo;
