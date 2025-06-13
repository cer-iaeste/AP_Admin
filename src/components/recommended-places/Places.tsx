import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css" // Keep this if it contains global styles you need
import { CityType } from "../../types/types"; // Assuming CityType has name and description
import useWindowSize from "../../hooks/useScreenSize";
import { CardProps } from "../../global/Global"; // Assuming CardProps and handleInputChange are defined
import Back from "../../global/Back"; // Import the Back component (assuming it's intended to be used with CardProps)

interface PlacesProps extends CardProps {
    places: CityType[]
}

const Places: React.FC<PlacesProps> = ({ country, places, handleSave, handleDelete, handleCancel, handleAddNewItem, handleInputChange }) => { // handleBack added to destructuring
    const [placesData, setPlacesData] = useState<CityType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

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

    // Handler to add a new empty place item
    const onAdd = () => handleAddNewItem(setPlacesData, placesData, { name: "", description: "" }, setIsChanged)
    
    // Handler to save all changes
    const onSave = () => handleSave(country, placesData, "cities", "Recommended places", setIsChanged)
    
    // Handler to delete a specific place item by index
    const onDelete = (index: number) => handleDelete(index, setPlacesData, placesData, setIsChanged)
    
    // Handler to cancel all unsaved changes
    const onCancel = () => handleCancel(isChanged, setPlacesData, places, setIsChanged)
    
    // Handler for input changes in individual place fields
    const onInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>, index: number, column: string) => { // Use React.ChangeEvent<HTMLTextAreaElement> for textareas
        handleInputChange(setPlacesData, placesData, index, e.target.value, setIsChanged, column)
    }

    return (
        <section className="p-4 bg-sky-100 min-h-screen text-[#1B75BB]">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Header for the component */}
                <div className="flex flex-col justify-center text-center md:text-left">
                    {/* Back Button */}
                    <div className="mb-4">
                        {/* Assuming 'Back' component exists and can receive 'isChanged' for confirmation */}
                        <Back confirmationNeeded={isChanged} />
                    </div>
                    
                    <span className="font-semibold text-3xl lg:text-4xl text-gray-800">Recommended Places</span>
                    <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start">
                        <i className="fa fa-circle-info mr-3 text-2xl"></i>
                        <span>Add and manage recommended places for the country.</span>
                    </div>
                </div>

                {/* Grid for Place Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                    {placesData.map((city, index) => (
                        <div
                            key={index}
                            className="
                                bg-white p-6 rounded-xl shadow-lg border border-gray-200
                                flex flex-col space-y-4 relative // Added relative for absolute positioning of delete button
                                transition-all duration-200 transform hover:scale-103 hover:shadow-xl // Subtle hover effect
                            "
                        >
                            {/* Delete Button - Positioned absolutely at top right */}
                            <div className="absolute top-3 right-3 z-10">
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="
                                        w-8 h-8 rounded-full flex items-center justify-center
                                        text-red-500 hover:bg-red-500 hover:text-white
                                        transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500
                                    "
                                    title="Remove place"
                                >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </div>
                            
                            {/* Name Input Section */}
                            <div className="flex flex-col space-y-2">
                                <div className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">
                                    Name
                                </div>
                                <textarea
                                    placeholder="Place name"
                                    rows={2}
                                    value={city.name}
                                    onChange={(e) => onInputChange(e, index, "name")}
                                    className="
                                        w-full p-3 border border-gray-300 rounded-md
                                        focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-lg
                                    "
                                    style={{ scrollbarWidth: 'thin'}}
                                />
                            </div>

                            {/* Description Input Section */}
                            <div className="flex flex-col space-y-2">
                                <div className="text-lg font-semibold text-gray-700 pb-2 border-b border-gray-200">
                                    Description
                                </div>
                                <textarea
                                    placeholder="Description"
                                    rows={width > 640 ? 8 : 4} // Responsive rows based on screen width
                                    value={city.description}
                                    onChange={(e) => onInputChange(e, index, "description")}
                                    className="
                                        w-full p-3 border border-gray-300 rounded-md
                                        focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-lg
                                    "
                                    style={{ scrollbarWidth: 'thin'}}
                                />
                            </div>
                        </div>
                    ))}

                    {/* Add New Place Button */}
                    <div className="flex items-end"> {/* Use flex items-end to align button to the bottom of its grid cell */}
                        <button
                            className="
                                w-full bg-blue-600 text-white py-3 px-6 rounded-xl shadow-md
                                hover:bg-blue-700 transition-colors duration-200
                                flex items-center justify-center gap-2 text-lg font-semibold
                                focus:outline-none focus:ring-2 focus:ring-blue-400
                            "
                            onClick={onAdd}
                        >
                            <i className="fa fa-plus"></i> Add a new place
                        </button>
                    </div>
                </div>

                {/* Reusable CardFooter Component */}
                <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
            </div>
        </section>
    )
}

export default Places;
