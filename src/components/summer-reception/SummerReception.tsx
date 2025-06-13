import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import Weekend from "./Weekend"
import { WeekendType } from "../../types/types";
import "../card/Card.css"
import { CardProps } from "../../global/Global";


interface SummerReceptionProps extends CardProps{
    summerReception: WeekendType[]
}

const SummerReception: React.FC<SummerReceptionProps> = ({ country, summerReception, handleSave, handleCancel, handleDelete }) => {
    const [summerReceptionData, setSummerReceptionData] = useState<WeekendType[]>([]);
    const [selectedWeekend, setSelectedWeekend] = useState<WeekendType | null>(null)
    const [isEditMode, setIsEditMode] = useState(false)
    const [isChanged, setIsChanged] = useState(false)

    const newWeekend: WeekendType = {
        name: "",
        startDate: "",
        endDate: "",
        location: "",
        link: "",
        limit: 0,
        description: ""
    }

    useEffect(() => {
        setSummerReceptionData(summerReception)
    }, [summerReception]);

    const closePopup = () => {
        setSelectedWeekend(null)
    }

    const handlePopupModel = (weekendData: WeekendType, editMode: boolean): void => {
        setIsEditMode(editMode)
        setSelectedWeekend(weekendData)
    }

    const handleSaveWeekend = (weekend: WeekendType) => {
        setSummerReceptionData(prev => {
            // Update existing weekend
            if (isEditMode) return prev.map(w => (w.name === weekend.name ? weekend : w));
            // Add new weekend
            return [...prev, weekend];
        });
        setIsChanged(true);
        closePopup();
    };
    

    const onSave = () => handleSave(country, summerReceptionData, "summerReception", "Summer Reception", setIsChanged)
    const onCancel = () => handleCancel(isChanged, setSummerReceptionData, summerReception, setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setSummerReceptionData, summerReceptionData, setIsChanged)

    return (
        <div>
            {selectedWeekend !== null && <Weekend selectedWeekend={selectedWeekend} isEditMode={isEditMode} onClose={closePopup} onSave={handleSaveWeekend}/>}
            <section className="grid grid-cols-1 sm:grid-cols-2 gap-5 mt-10 p-1">
                {!!summerReceptionData.length && summerReceptionData.map((weekend, index) =>
                    <div key={index} className={`p-4 bg-gradient text-white rounded-md flex flex-col`}>
                        <h2 className="font-semibold text-xl md:text-2xl border-b-2 pb-2">{weekend.name}</h2>
                        <div className='flex flex-col mt-2 border-b-2 pb-2 space-y-1'>
                            <div className="flex items-center text-xl">
                                <i className="far fa-calendar-alt mr-2"></i> Date: {weekend.startDate + " - " + weekend.endDate}
                            </div>
                            <div className="flex items-center text-xl">
                                <i className="fas fa-map-marker-alt mr-2"></i> Location: {weekend.location}
                            </div>
                            <div className="flex items-center text-xl">
                                <i className="fas fa-link mr-1"></i> Link: {weekend.link ?? "No Registration link"}
                            </div>
                            <div className="flex items-center text-xl">
                                <i className="fas fa-users mr-1"></i> Limit: {weekend.limit ?? "No registration limit"}
                            </div>
                        </div>
                        {/* Buttons in the bottom right */}
                        <div className="flex space-x-3 justify-end mt-2">
                            {/* Remove button */}
                            <button
                                type="button"
                                onClick={() => onDelete(index)}
                                className="btn flex items-center rounded-full border-2 border-red-500 bg-white text-red-500 font-semibold p-2 hover:bg-red-500 hover:text-white hover:shadow-xl"
                            >
                                <i className="fa fa-trash mr-2" aria-hidden="true"></i> Delete
                            </button>
                            {/* Edit/Save button */}
                            <button
                                type="button"
                                onClick={() => handlePopupModel(weekend, true)}
                                className={`btn flex items-center rounded-full border-2 border-[#1B75BB] p-2 bg-white text-[#1B75BB] font-semibold hover:bg-[#1B75BB] hover:text-white hover:shadow-xl`}
                            >
                                <i className={`fa fa-pencil-alt mr-2`} aria-hidden="true"></i>Edit
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-end">
                    <button className="add-btn hover-bg-gradient"
                        onClick={() => handlePopupModel(newWeekend, false)}>
                        <i className="fa fa-plus"></i> Add new item
                    </button>
                </div>
            </section>
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
        </div>
    )
}

export default SummerReception