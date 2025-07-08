import React, { useState, useEffect, useContext, useCallback } from "react"
import Weekend from "./Weekend"
import { WeekendType } from "../../types/types"
import "../card/Card.css"
import CardContext from "../card/CardContext"
import { toast } from 'react-toastify'
import AddBtn from "../card/Add"
import FormButtons from "../card/FormButtons"

interface SummerReceptionProps {
    summerReception: WeekendType[]
}

// Define a consistent structure for a new weekend item
const newWeekendTemplate: WeekendType = {
    name: "",
    startDate: "",
    endDate: "",
    location: "",
    link: "",
    limit: 0,
    description: ""
};

const SummerReception: React.FC<SummerReceptionProps> = ({ summerReception }) => {
    const context = useContext(CardContext);
    // All useState, useCallback, useEffect hooks must be called unconditionally before any early returns
    const [mappedData, setMappedData] = useState<WeekendType[]>([])
    const [summerReceptionData, setSummerReceptionData] = useState<WeekendType[]>([]);
    const [selectedWeekend, setSelectedWeekend] = useState<WeekendType | null>(null); // For popup modal
    const [isEditMode, setIsEditMode] = useState(false); // To determine if modal is for edit or add

    const mapWeekend = (weekend: WeekendType) => {
        const formatDate = (date: string) => {
            const [year, month, day] = date.split("-")
            const yearChars = Array.from(year)
            return `${day}.${month}.${yearChars[2]}${yearChars[3]}`
        }

        const start = formatDate(weekend.startDate)
        const end = formatDate(weekend.endDate)

        return {
            ...weekend,
            date: `${start} - ${end}`
        }
    }

    const mapWeekends = useCallback((summerReception: WeekendType[]) =>
        summerReception.map(weekend => mapWeekend(weekend))
    , [])

    // Initialize summerReceptionData state when 'summerReception' prop changes
    useEffect(() => {
        setMappedData(mapWeekends(summerReception))
        // setSummerReceptionData(structuredClone(summerReception)); // Deep clone to avoid direct mutation
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [summerReception]);

    useEffect(() => {
        setSummerReceptionData(mappedData)
    }, [mappedData])

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        setIsChanged(JSON.stringify(summerReceptionData) !== JSON.stringify(mappedData));
    }, [summerReceptionData, summerReception]); // Depend on both states to detect changes

    // Defensive check after all hooks are called
    if (!context) return null
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleDelete, handleCancel, setIsChanged, isChanged, isLoading } = context;

    // Handler to close the popup modal
    const closePopup = () => setSelectedWeekend(null)

    // Handler to open the popup modal (for add or edit)
    const handlePopupModel = (weekendData: WeekendType, editMode: boolean): void => {
        setIsEditMode(editMode);
        setSelectedWeekend(weekendData);
    };

    // Handler for saving a weekend from the popup modal back to local state
    const handleSaveWeekend = (weekend: WeekendType) => {
        setSummerReceptionData(prev =>
            isEditMode ? prev.map(w => (w.name === weekend.name ? weekend : w)) : [...prev, mapWeekend(weekend)]
        )
        setIsChanged(true) // Mark as changed
        closePopup()
        toast.success(`Weekend "${weekend.name}" added. Click "Save" to apply changes.`);
    };
    
    const onSave = async () => {
        const dataToSave = summerReceptionData.filter(weekend => weekend.name.trim() !== '');
        handleSave(countryName, dataToSave, "summerReception", "Summer Reception Events");
    };

    const onCancel = async () => 
        await handleCancel(setSummerReceptionData, mappedData) ? toast.info("Changes discarded.") : toast.info("Cancellation aborted.");

    // Handler for deleting a weekend event
    const onDelete = async (index: number) => {
        const deleted = await handleDelete(index, setSummerReceptionData, summerReceptionData);
        if (deleted) toast.info("Event removed!");
    };

    return (
        <section className="my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {summerReceptionData.map((weekend, index) => (
                        <div
                            key={index}
                            className="
                                bg-sky-50 p-6 rounded-2xl shadow-xl border border-blue-100
                                flex flex-col h-72 // Dynamic height but ensures a minimum
                                transition-all duration-300 transform hover:scale-103 hover:shadow-2xl
                            "
                        >
                            {/* Card Header with Title and Buttons */}
                            <div className="
                                flex justify-between items-center pb-2 mb-4 border-b-2 border-blue-200
                                text-base md:text-xl font-bold text-gray-800
                            ">
                                <span className="truncate pr-2">{weekend.name || `Weekend #${index + 1}`}</span>
                                <div className="flex items-center gap-2">
                                    <button
                                        type="button"
                                        onClick={() => handlePopupModel(weekend, true)}
                                        className="
                                            w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center
                                            hover:bg-blue-600 hover:text-white transition-colors duration-200
                                            focus:outline-none focus:ring-2 focus:ring-blue-500
                                        "
                                        title="Edit event"
                                    >
                                        <i className="fa fa-pencil-alt text-base" aria-hidden="true"></i>
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index)}
                                        className="
                                            w-8 h-8 rounded-full bg-blue-100 text-red-600 flex items-center justify-center
                                            hover:bg-red-600 hover:text-white transition-colors duration-200
                                            focus:outline-none focus:ring-2 focus:ring-red-500
                                        "
                                        title="Remove event"
                                    >
                                        <i className="fa fa-trash text-base" aria-hidden="true"></i>
                                    </button>
                                </div>
                            </div>
                            
                            {/* Card Body - Event Details */}
                            <div className="flex flex-col flex-1 space-y-3 text-gray-700 text-base md:text-xl font-semibold">
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-calendar-alt text-blue-500 mr-3"></i>
                                    <span>{weekend.date}</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <i className="fa-solid fa-location-dot text-blue-500 mr-3"></i>
                                    <span>{weekend.location || 'N/A'}</span>
                                </div>
                                {weekend.link && (
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-link text-blue-500 mr-1"></i>
                                        <a href={weekend.link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline truncate">
                                            Registration Link
                                        </a>
                                    </div>
                                )}
                                {weekend.limit > 0 && (
                                    <div className="flex items-center gap-2">
                                        <i className="fa-solid fa-users text-blue-500 mr-2"></i>
                                        <span>{weekend.limit} participants</span>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}

                    <AddBtn onAdd={() => handlePopupModel(newWeekendTemplate, false)} />
                </div>

                <FormButtons isChanged={isChanged} isLoading={isLoading} onCancel={onCancel} onSave={onSave} />

                {/* Popup Modal for Add/Edit Weekend */}
                {selectedWeekend !== null && (
                    <Weekend
                        selectedWeekend={selectedWeekend}
                        isEditMode={isEditMode}
                        onClose={closePopup}
                        onSave={handleSaveWeekend}
                    />
                )}
        </section>
    );
};

export default SummerReception;
