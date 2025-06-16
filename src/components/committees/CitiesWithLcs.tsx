import React, { useState, useEffect, useContext } from "react";
import "../card/Card.css"; // Keep this if it contains global styles you need
import { toast } from 'react-toastify'; // Import toast for notifications
import FormButtons from "../card/FormButtons";
import CardContext from "../card/CardContext"

interface CitiesProps {
    cities: string[];
}

const CitiesWithLcs: React.FC<CitiesProps> = ({ cities }) => {
    // Consume context to get shared functions and countryName
    const context = useContext(CardContext);

    const [committeesData, setCommitteesData] = useState<string[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [newCityName, setNewCityName] = useState(""); // State for the new city input field

    // Initialize committeesData when the 'cities' prop changes
    useEffect(() => {
        setCommitteesData(structuredClone(cities));
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [cities]);

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        setIsChanged(JSON.stringify(committeesData) !== JSON.stringify(cities));
    }, [committeesData, cities]);

        // Defensive check: ensure context is available
    if (!context) {
        console.error("Component must be used within a CardContext.Provider");
        return null; // Or throw an error, or render a fallback UI
    }
    // Destructure required functions and countryName from context
    const { countryName, handleSave, handleCancel, handleAddNewItem, handleDelete } = context;

    // Handler to add a new city from the input field
    const onAddNewCity = () => {
        // Check for duplicates (case-insensitive)
        if (committeesData.some(city => city.toLowerCase() === newCityName.trim().toLowerCase())) {
            toast.error("This city already exists.");
            setNewCityName(""); // Clear the input even if duplicate
            return;
        }

        // Use handleAddNewItem if it correctly adds to the array state
        handleAddNewItem(setCommitteesData, committeesData, newCityName.trim(), setIsChanged);
        setNewCityName("")
    };

    // Handler to save all changes
    const onSave = () => handleSave(countryName, committeesData, "committees", "Cities with LCs", setIsChanged);

    const onCancel = () => handleCancel(isChanged, setCommitteesData, cities, setIsChanged)

    // Handler to delete a specific city by index
    const onDelete = (index: number) => handleDelete(index, setCommitteesData, committeesData, setIsChanged);

    return (
        <div className="bg-white p-8 rounded-2xl shadow-xl border border-blue-100 flex flex-col space-y-8  mt-8">
            {/* Display existing cities as tags - Enhanced Design */}
            <div className="
                        flex flex-wrap gap-4 p-4 border border-blue-200 rounded-lg min-h-[100px] // Larger gap, padding, blue border
                        bg-blue-50 items-start shadow-inner // Subtle blue background, inner shadow for depth
                    ">
                {committeesData.length > 0 ? (
                    committeesData.map((city, index) => (
                        <span key={index} className="inline-flex items-center bg-gradient-to-br from-blue-200 to-blue-300 text-blue-900
                                        text-xl font-semibold px-5 py-2.5 rounded-full
                                        shadow-md border border-blue-400
                                        transition-all duration-300 ease-in-out
                                        hover:from-blue-300 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:border-blue-500
                                        cursor-pointer transform
                                    "
                        >
                            {city}
                            <button
                                type="button"
                                onClick={() => onDelete(index)}
                                className="
                                            ml-3 text-blue-700 hover:text-red-700
                                            focus:outline-none focus:ring-2 focus:ring-red-500
                                            rounded-full p-1 -mr-1.5
                                            transition-colors duration-200
                                        "
                                title={`Remove ${city}`}
                            >
                                <i className="fa fa-times text-sm"></i>
                            </button>
                        </span>
                    ))
                ) : (
                    <p className="text-gray-500 text-center w-full py-6 text-lg">No cities added yet. Start typing above!</p> // Larger text, more inviting
                )}
            </div>

            {/* Input for adding new cities - Enhanced Design */}
            <div className="flex flex-col sm:flex-row gap-4 items-center py-6 border-t border-blue-100 border-b"> {/* Increased padding, blue border */}
                <input
                    type="text"
                    placeholder="Enter new city name..." // Clearer placeholder
                    value={newCityName}
                    onChange={(e) => setNewCityName(e.target.value)}
                    onKeyDown={(e) => { // Allow adding by pressing Enter key
                        if (e.key === 'Enter') {
                            onAddNewCity();
                        }
                    }}
                    className="
                                flex-1 w-full p-4 border-2 border-blue-300 rounded-lg // Thicker, blue border
                                focus:outline-none focus:ring-3 focus:ring-sky-400 focus:border-sky-500 // More prominent focus
                                text-gray-800 text-xl shadow-sm font-semibold // Text size, subtle shadow
                                placeholder-gray-400 // Placeholder color
                            "
                />
                <button
                    type="button"
                    onClick={onAddNewCity}
                    className={`w-full sm:w-auto px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg font-semibold
                                ${newCityName ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-blue-400"
                                    : "bg-stone-100 text-stone-300"
                                }
                            `}
                    disabled = {!newCityName}
                >
                    <i className="fa fa-plus text-xl"></i> Add City
                </button>
            </div>

            {/* CardFooter for Save action only */}
            <FormButtons isChanged={isChanged} onSave={onSave} isLoading={isLoading} onCancel={onCancel}/>
        </div>
    );
};

export default CitiesWithLcs;
