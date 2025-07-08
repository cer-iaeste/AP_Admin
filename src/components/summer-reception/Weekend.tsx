import React, { useState, useEffect, useRef } from "react";
import "./Weekend.css" // Keep this if it contains global styles you need
import { WeekendType } from "../../types/types";

interface WeekendProps {
    selectedWeekend: WeekendType;
    isEditMode: boolean;
    onClose: () => void;
    onSave: (weekend: WeekendType) => void;
}

const Weekend: React.FC<WeekendProps> = ({ selectedWeekend, isEditMode, onClose, onSave }) => {
    const [weekendData, setWeekendData] = useState<WeekendType>(selectedWeekend);
    const popupRef = useRef<HTMLDivElement>(null);
    const [enableBtns, setEnableBtns] = useState<boolean>(false)

    useEffect(() => {
        // When selectedWeekend prop changes, update local state
        setWeekendData(selectedWeekend);
    }, [selectedWeekend]);

    useEffect(() => {
        const { name, startDate, endDate, location } = weekendData
        setEnableBtns(name && startDate && endDate && location ? true : false)
    }, [weekendData])

    useEffect(() => {
        // Add event listener for the Escape key to close the modal
        const handleEscapeKey = (event: KeyboardEvent) => {
            if (event.key === 'Escape') onClose();
        };

        document.addEventListener("keydown", handleEscapeKey);

        // Cleanup function to remove event listener
        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]); // Dependency array includes onClose to ensure it's up-to-date

    // Handle input changes for all form fields
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        setWeekendData((prevData) => ({
            ...prevData,
            [name]: name === "limit" ? parseInt(value) || 0 : value, // Convert limit to number, handle NaN
        }));
    };

    // Handle form submission (save changes)
    const handleSave = () => {
        // Basic validation before saving
        if (!weekendData.name.trim() || !weekendData.startDate.trim() || !weekendData.endDate.trim() || !weekendData.location.trim()) {
            alert("Please fill in all required fields (Name, Dates, Location)."); // Consider using a toast notification here
            return;
        }
        onSave(weekendData); // Call parent's onSave handler
    };

    // Handle cancel changes
    const handleCancel = () => {
        setWeekendData(selectedWeekend); // Reset to original data
        onClose(); // Close the form
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50"> {/* Overlay */}
            {/* The main popup container */}
            <div
                className="
                    relative bg-white rounded-2xl shadow-2xl border border-gray-200
                    w-full max-w-2xl max-h-[90vh] flex flex-col // Responsive width, max height, flex column layout
                "
                ref={popupRef}
            >
                {/* Header */}
                <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
                    <span className="text-2xl font-bold">{isEditMode ? "Edit Weekend" : "Add New Weekend"}</span>
                    <button
                        onClick={onClose}
                        className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200"
                        title="Close"
                    >
                        <i className="fa-solid fa-x text-white"></i>
                    </button>
                </div>
                
                {/* Scrollable Content Area (Form) */}
                <div className="w-full p-6 bg-white text-gray-800 overflow-y-auto flex-grow" style={{ scrollbarWidth: "thin" }}>
                    <form className="space-y-6"> {/* Increased spacing */}
                        {/* Event Name */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="name" className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-umbrella-beach text-blue-500"></i> Event Name:
                            </label>
                            <input
                                id="name"
                                type="text"
                                name="name"
                                value={weekendData.name}
                                onChange={handleInputChange}
                                placeholder="e.g., Summer Weekend in Skopje"
                                className="
                                    w-full p-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    text-gray-800 text-base shadow-sm
                                "
                            />
                        </div>

                        {/* Date Range */}
                        <div className="flex flex-col space-y-1">
                            <label className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-calendar-alt text-blue-500"></i> Dates:
                            </label>
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4"> {/* Side-by-side on small screens */}
                                <input
                                    type="date"
                                    name="startDate"
                                    value={weekendData.startDate}
                                    onChange={handleInputChange}
                                    className="
                                        w-full p-3 border border-gray-300 rounded-lg bg-white
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        text-gray-800 text-base shadow-sm
                                    "
                                />
                                <input
                                    type="date"
                                    name="endDate"
                                    value={weekendData.endDate}
                                    onChange={handleInputChange}
                                    className="
                                        w-full p-3 border border-gray-300 rounded-lg bg-white
                                        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                        text-gray-800 text-base shadow-sm
                                    "
                                />
                            </div>
                        </div>

                        {/* Location */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="location" className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-map-marker-alt text-blue-500"></i> Location:
                            </label>
                            <input
                                id="location"
                                type="text"
                                name="location"
                                value={weekendData.location}
                                onChange={handleInputChange}
                                placeholder="e.g., Ohrid Lake"
                                className="
                                    w-full p-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    text-gray-800 text-base shadow-sm
                                "
                            />
                        </div>

                        {/* Link */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="link" className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-link text-blue-500"></i> Registration Link:
                            </label>
                            <input
                                id="link"
                                type="text"
                                name="link"
                                value={weekendData.link}
                                onChange={handleInputChange}
                                placeholder="Optional: Enter registration link"
                                className="
                                    w-full p-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    text-gray-800 text-base shadow-sm
                                "
                            />
                        </div>

                        {/* Limit */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="limit" className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-users text-blue-500"></i> Participants Limit:
                            </label>
                            <input
                                id="limit"
                                type="number"
                                name="limit"
                                value={weekendData.limit || ''} // Handle 0 or null for placeholder
                                onChange={handleInputChange}
                                placeholder="Optional: Max. Participants"
                                className="
                                    w-full p-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    text-gray-800 text-base shadow-sm
                                "
                            />
                        </div>

                        {/* Description */}
                        <div className="flex flex-col space-y-1">
                            <label htmlFor="description" className="text-base font-semibold text-gray-700 flex items-center gap-2 mb-1">
                                <i className="fa-solid fa-file-lines text-blue-500"></i> Description:
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                value={weekendData.description}
                                onChange={handleInputChange}
                                placeholder="Enter a detailed description of the event"
                                rows={6} // Increased rows for more visible description
                                className="
                                    w-full p-3 border border-gray-300 rounded-lg bg-white
                                    focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500
                                    text-gray-800 text-base shadow-sm
                                    resize-y // Allow vertical resizing
                                "
                                style={{ scrollbarWidth: 'thin'}}
                            />
                        </div>
                    </form>
                </div>
                
                {/* Fixed Footer */}
                <footer className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0 rounded-b-2xl">
                    <button
                        type="button"
                        onClick={handleCancel}
                        className="
                            px-6 py-2 rounded-lg font-semibold
                            bg-red-500 text-white hover:bg-red-600
                            transition-all duration-200 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-500
                        "
                    >
                        <i className="fa fa-ban mr-2" aria-hidden="true"></i>
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSave}
                        className={`
                            px-6 py-2 rounded-lg font-semibold
                            ${enableBtns ?
                                "bg-blue-600 text-white hover:bg-blue-700 hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                : "bg-gray-500 text-gray-400"
                            }
                            
                            transition-all duration-200 transform 
                        `}
                        disabled={!enableBtns}
                    >
                        <i className="fa fa-save mr-2" aria-hidden="true"></i>
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default Weekend;
