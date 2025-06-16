import React, { useState, useEffect, useContext } from "react";
import "../card/Card.css"
import { CityType } from "../../types/types";
import CardContext from "../card/CardContext";
import FormButtons from "../card/FormButtons";
import CardGrid from "../card/CardGrid";

interface PlacesProps {
    places: CityType[]
}

const Places: React.FC<PlacesProps> = ({ places }) => {
    const context = useContext(CardContext);
    const [placesData, setPlacesData] = useState<CityType[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const [isLoading, setIsLoading] = useState(false);

    // Effect to initialize placesData state when 'places' prop changes
    useEffect(() => {
        setPlacesData(places)
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [places])

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        const hasChanges = JSON.stringify(placesData) !== JSON.stringify(places);
        setIsChanged(hasChanges);
        // If you have a handleChange prop from the parent to update a shared state, call it here:
        // if (handleChange) handleChange(hasChanges);
    }, [placesData, places]); // Depend on both states to detect changes

    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel, handleAddNewItem, handleDelete } = context;

    // Handler to add a new empty place item
    const onAdd = () => handleAddNewItem(setPlacesData, placesData, { name: "", description: "" }, setIsChanged)

    // Handler to save all changes
    const onSave = () => handleSave(countryName, placesData, "cities", "Recommended places", setIsChanged)

    // Handler to delete a specific place item by index
    const onDelete = (index: number) => handleDelete(index, setPlacesData, placesData, setIsChanged)

    // Handler to cancel all unsaved changes
    const onCancel = () => handleCancel(isChanged, setPlacesData, places, setIsChanged)

    // Handler for input changes in individual place fields
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, column?: string) => { // Use React.ChangeEvent<HTMLTextAreaElement> for textareas
        handleInputChange(setPlacesData, placesData, places, index, e.target.value, setIsChanged, column)
    }

    return (
        <CardGrid title="Place" data={placesData} isChanged={isChanged} isLoading={isLoading} onDelete={onDelete} onInputChange={onInputChange} onSave={onSave} onAdd={onAdd} onCancel={onCancel} />
    )
}

export default Places;
