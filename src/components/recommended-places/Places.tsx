import React, { useState, useEffect, useContext } from "react";
import "../card/Card.css"
import { CardObject, CityType, MappedCardProps } from "../../types/types";
import CardContext from "../card/CardContext";
import FormButtons from "../card/FormButtons";
import CardGrid from "../card/CardGrid";
import { mapCardContent } from "../../global/Global";

interface PlacesProps {
    places: CityType[]
}

const Places: React.FC<PlacesProps> = ({ places }) => {
    const context = useContext(CardContext);
    const [placesData, setPlacesData] = useState<CardObject[]>([])
    const [isLoading, setIsLoading] = useState(false);

    // Effect to initialize placesData state when 'places' prop changes
    useEffect(() => {
        setIsLoading(true)
        setPlacesData(mapCardContent(places))
        setIsChanged(false); // Reset changed status on initial load or prop update
        setIsLoading(false)
    }, [places])

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        const hasChanges = JSON.stringify(placesData.map(item => item.data)) !== JSON.stringify(places);
        setIsChanged(hasChanges);
    }, [placesData, places]); // Depend on both states to detect changes

    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel, handleAddNewItem, handleDelete, isChanged, setIsChanged } = context;

    // Handler to add a new empty place item
    const onAdd = () => handleAddNewItem(setPlacesData, placesData, { name: "", description: "" })

    // Handler to save all changes
    const onSave = () => handleSave(countryName, placesData, "cities", "Recommended places", true)

    // Handler to delete a specific place item by index
    const onDelete = async (index: number) => {
        const confirmation = await handleDelete(index, setPlacesData, placesData)
        if (confirmation) onSave()
    }

    // Handler to cancel all unsaved changes
    const onCancel = () => handleCancel(setPlacesData, places, true)

    // Handler for input changes in individual place fields
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, column?: string) => { // Use React.ChangeEvent<HTMLTextAreaElement> for textareas
        handleInputChange(setPlacesData, placesData, places, index, e.target.value, column)
    }

    return (
        <CardGrid title="Place" data={placesData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    )
}

export default Places;
