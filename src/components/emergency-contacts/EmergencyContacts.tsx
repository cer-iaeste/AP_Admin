import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { EmergencyContactsType } from "../../types/types";
import "../card/Card.css"
import { CardProps, EMERGENCY_NUMBERS_CONSTANTS } from "../../global/Global";

interface EmergencyContactsProps extends CardProps{
    emergencyContacts: EmergencyContactsType[]
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts, country, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [contactData, setContactData] = useState<EmergencyContactsType[]>([]);
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        setContactData(structuredClone(emergencyContacts))
    }, [emergencyContacts]);

    // Function to get dynamic options based on current selected titles in contactData
    const getAvailableOptions = (excludeIndex: number) => {
        const selectedTitles = contactData
            .filter((_, index) => index !== excludeIndex) // Exclude current row
            .map((contact) => contact.title);

        return Object.keys(EMERGENCY_NUMBERS_CONSTANTS).filter(
            (title) => !selectedTitles.includes(title)
        );
    };

    const onAdd = () => {
        if (contactData.length < 4) handleAddNewItem(setContactData, contactData, { title: "", number: "" }, setIsChanged)
    };
    const onSave = () => handleSave(country, contactData, "emergencyContacts", "Emergency contacts", setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setContactData, contactData, setIsChanged)
    const onCancel = () => handleCancel(isChanged, setContactData, emergencyContacts, setIsChanged)
    const onBack = () => handleBack(isChanged, setContactData, emergencyContacts, setIsChanged)
    const onInputChange = (e: any, index: number, column: string) => handleInputChange(setContactData, contactData, index, e.target.value, setIsChanged, column)

    return (
        <div className="table-margins">
            {!!contactData.length ? (
                <table className="card-table">
                    <thead>
                        <tr className="card-table-head">
                            <th>Title</th>
                            <th>Emergency Number</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactData.map((contact, index) => (
                            <tr key={index} className="card-table-row text-base sm:text-xl">
                                <td className="p-4">
                                    {contact.title !== "" ? (
                                        contact.title
                                    ) : (
                                        <select
                                            value={contact.title}
                                            onChange={(e) => onInputChange(e, index, "title")}
                                            className="w-full text-center p-1"
                                        >
                                            <option value="" disabled>Select Title</option>
                                            {getAvailableOptions(index).map((option) => (
                                                <option key={option} value={option}>
                                                    {option}
                                                </option>
                                            ))}
                                        </select>
                                    )}
                                </td>
                                <td className="p-4">
                                    <input
                                        type="text"
                                        placeholder="Emergency number"
                                        value={contact.number}
                                        onChange={(e) => onInputChange(e, index, "number")}
                                        className="w-full p-2 border text-base sm:text-xl bg-[#F1F1E6]"
                                    />
                                </td>
                                <td className="w-10">
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index)}
                                        className="btn delete-btn"
                                    >
                                        <i className="fa fa-trash" aria-hidden="true"></i>
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <div className="text-gray-500 mt-2">No emergency contacts available.</div>
            )}

            {contactData.length < 4 && (
                <div className="flex items-end mt-5">
                    <button
                        className="add-btn hover-bg-gradient"
                        onClick={onAdd}
                    >
                        <i className="fa fa-plus"></i> Add emergency number
                    </button>
                </div>
            )}

            {/* Reusable Footer Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    );
};

export default EmergencyContacts;
