import React, { useState, useEffect } from "react";
import { CardFormType, TabProps } from "../../types/types";
import CardForm from "../card/Form";

interface CountryInfoProps extends TabProps {
    countryName: string
    region: string,
    handleCountryInfoSave: (newCountryName: string, newRegion: string) => void
}

const CountryInfoTab: React.FC<CountryInfoProps> = ({ countryName, region, setIsChanged, isChanged, isLoading, handleCancel, handleCountryInfoSave }) => {
    const [countryInfoItems, setCountryInfoItems] = useState<CardFormType[]>([])

    const setInitialCountryInfo = () => {
        setCountryInfoItems([
            {
                name: "Country name",
                value: countryName,
                icon: "fa-solid fa-flag"
            },
            {
                name: "Region",
                value: region,
                icon: "fa-solid fa-globe",
                isSelect: true,
                options: [
                    { value: "", display: "Select a Region" },
                    { value: "cer", display: "CER" },
                    { value: "core", display: "CoRe" },
                    { value: "other", display: "Other" }
                ]
            }
        ])
    }

    useEffect(() => {
        if (countryName && region) setInitialCountryInfo()
    }, [countryName, region])


    const onCountryInfoInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>, index: number) => {
        const { value } = e.target
        const updated = [...countryInfoItems]
        updated[index].value = value
        setCountryInfoItems(updated);
        setIsChanged((index === 0 && value !== countryName) || (index === 1 && value !== region))
    }

    const onCancel = () => handleCancel(setInitialCountryInfo)
    
    const onSave = () => handleCountryInfoSave(countryInfoItems[0].value, countryInfoItems[1].value)

    return (
        <CardForm items={countryInfoItems} onInputChange={onCountryInfoInputChange} isChanged={isChanged} isLoading={isLoading} onCancel={onCancel} onSave={onSave} />
    )
}

export default CountryInfoTab;