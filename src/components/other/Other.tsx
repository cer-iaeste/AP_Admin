import React, { useState, useEffect, useContext } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { OtherType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";
import CardContext from "../card/CardContext";
import CardGrid from "../card/CardGrid";

interface OtherProps {
    other: OtherType[]
}

const Other: React.FC<OtherProps> = ({ other }) => {
    const context = useContext(CardContext);
    const [otherData, setOtherData] = useState<OtherType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    const { width } = useWindowSize()

    useEffect(() => {
        setOtherData(other)
    }, [other])

    // Defensive check after all hooks are called
    if (!context) return null; // Or throw an error, or render a fallback UI
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel,handleAddNewItem, handleDelete } = context;

    const onAdd = () => handleAddNewItem(setOtherData, otherData, { title: "", description: "" }, setIsChanged)
    const onSave = () => handleSave(countryName, otherData, "otherInformation", "Other information", setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setOtherData, otherData, setIsChanged)
    const onCancel = () => handleCancel(isChanged, setOtherData, otherData, setIsChanged)
    const onInputChange = (e: any, index: number, column?: string) => handleInputChange(setOtherData, otherData, other, index, e.target.value, setIsChanged, column)

    return (
        <CardGrid title="Info" data={otherData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    )
}

export default Other;