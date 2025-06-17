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

    useEffect(() => {
        setOtherData(other)
    }, [other])

    // Defensive check after all hooks are called
    if (!context) return null; // Or throw an error, or render a fallback UI
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel,handleAddNewItem, handleDelete, isChanged, isLoading } = context;

    const onAdd = () => handleAddNewItem(setOtherData, otherData, { title: "", description: "" })
    const onSave = () => handleSave(countryName, otherData, "otherInformation", "Other information")
    const onDelete = (index: number) => handleDelete(index, setOtherData, otherData)
    const onCancel = () => handleCancel(setOtherData, otherData)
    const onInputChange = (e: any, index: number, column?: string) => handleInputChange(setOtherData, otherData, other, index, e.target.value, column)

    return (
        <CardGrid title="Info" data={otherData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    )
}

export default Other;