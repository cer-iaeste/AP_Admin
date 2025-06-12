import React, { useState, useEffect, useRef } from "react";
import "./Weekend.css"
import { WeekendType } from "../../types/types";

interface WeekendProps {
    selectedWeekend: WeekendType
    isEditMode: boolean
    onClose: () => void
    onSave: (weekend: WeekendType) => void
}

const Weekend: React.FC<WeekendProps> = ({ selectedWeekend, isEditMode, onClose, onSave }) => {
    const [weekendData, setWeekendData] = useState<WeekendType>(selectedWeekend);
    const popupRef = useRef<HTMLDivElement>(null); // Specify type for useRef

    useEffect(() => {
        setWeekendData(selectedWeekend)
    }, [selectedWeekend]);

    useEffect(() => {
        // escape button
        const handleEscapeKey = (event: KeyboardEvent) => { // Specify event type
            if (event.key === 'Escape') onClose(); // Use event.key for modern browsers
        };

        document.addEventListener("keydown", handleEscapeKey);

        return () => {
            document.removeEventListener("keydown", handleEscapeKey);
        };
    }, [onClose]);

    // Handle input changes
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        setWeekendData((prevData) => ({
            ...prevData,
            [name]: value,
        }));
    };

    // Handle form submission (save changes)
    const handleSave = () => onSave(weekendData)

    // Handle cancel changes
    const handleCancel = () => {
        setWeekendData(selectedWeekend)
        onClose(); // Close the form
    };

    return (
        <div className="overlay">
            {/* The main popup container */}
            <div className={`relative bg-gradient rounded-xl shadow-md w-4/5 h-4/5 flex flex-col`} // Added flex flex-col
                ref={popupRef} style={{ maxWidth: '800px', maxHeight: '600px' }}>
                
                {/* Header (static) */}
                <div className="flex w-full mx-auto justify-between items-center py-2 px-5 border-b flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <span className="text-2xl font-bold text-white">{isEditMode ? "Edit weekend" : "Add new weekend"}</span>
                    <button onClick={onClose} className="">
                        <i className="fa-solid fa-x text-white"></i>
                    </button>
                </div>
                
                {/* Scrollable Content Area */}
                <div className="w-full p-6 text-white overflow-y-auto flex-grow" style={{ scrollbarWidth: "thin" }}> {/* Changed mt- to flex-grow, added overflow-y-auto */}
                    <form className="space-y-4 -mt-8 text-xl">
                        <div className="form-row">
                            <label>
                                <i className="fa-solid fa-umbrella-beach"></i>
                            </label>
                            <input
                                type="text"
                                name="name"
                                value={weekendData.name}
                                onChange={handleInputChange}
                                placeholder="Event Name"
                                className="sm:col-span-12 text-input"
                            />
                        </div>
                        {/* Date Range */}
                        <div className="form-row">
                            <label>
                                <i className="fa fa-calendar-alt"></i>
                            </label>
                            <input
                                type="date"
                                name="startDate"
                                value={weekendData.startDate}
                                onChange={handleInputChange}
                                className="col-span-6 text-input"
                            />
                            <input
                                type="date"
                                name="endDate"
                                value={weekendData.endDate}
                                onChange={handleInputChange}
                                className="col-span-6 text-input"
                            />
                        </div>
                        {/* Location */}
                        <div className="form-row">
                            <label>
                                <i className="fa fa-map-marker-alt"></i>
                            </label>
                            <input
                                type="text"
                                name="location"
                                value={weekendData.location}
                                onChange={handleInputChange}
                                placeholder="Location"
                                className="col-span-12 text-input"
                            />
                        </div>

                        {/* Link */}
                        <div className="form-row">
                            <label>
                                <i className="fa fa-link"></i>
                            </label>
                            <input
                                type="text"
                                name="link"
                                value={weekendData.link}
                                onChange={handleInputChange}
                                placeholder="Registration Link"
                                className="underline col-span-12 text-input"
                            />
                        </div>
                        {/* Limit */}
                        <div className="form-row">
                            <label>
                                <i className="fa fa-users"></i>
                            </label>
                            <input
                                type="number"
                                name="limit"
                                value={weekendData.limit}
                                onChange={handleInputChange}
                                placeholder="Max. Participants"
                                className="col-span-12 text-input"
                            />
                        </div>
                        {/* Description */}
                        <div className="form-row">
                            <label>
                                <i className="fa fa-file-lines"></i>
                            </label>
                            <textarea
                                name="description"
                                value={weekendData.description}
                                onChange={handleInputChange}
                                placeholder="Description"
                                rows={8}
                                className="col-span-12 p-1 text-input"
                            />
                        </div>
                    </form>
                </div>
                
                {/* Fixed Footer */}
                <footer className="w-full border-t-2 p-2 flex-shrink-0"> {/* Added flex-shrink-0 */}
                    <div className="flex justify-end space-x-4 font-semibold">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="btn flex items-center rounded-md border-2 border-red-500 text-red-500 p-1 bg-white hover:bg-red-500 hover:text-white hover:shadow-xl"
                        >
                            <i className="fa fa-ban mr-1" aria-hidden="true"></i>
                            Cancel
                        </button>
                        <button
                            type="button"
                            onClick={handleSave}
                            className="btn flex items-center rounded-md border-2 border-[#1B75BB] text-[#1B75BB] p-1 bg-white hover:bg-[#1B75BB] hover:text-white hover:shadow-xl"
                        >
                            <i className="fa fa-save mr-1" aria-hidden="true"></i>
                            Save Changes
                        </button>
                    </div>
                </footer>
            </div>
        </div>
    );
};

export default Weekend;