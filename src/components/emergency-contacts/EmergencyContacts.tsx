import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { EmergencyContactsType } from "../../types/types";
import { updateCountryField } from "../../service/CountryService"
import "../card/Card.css"
import { EMERGENCY_NUMBERS_CONSTANTS } from "../../global/Global";

interface EmergencyContactsProps {
    emergencyContacts: EmergencyContactsType[]
    country: string
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts, country }) => {
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

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number) => {
        const newData = structuredClone(contactData);
        newData[index].number = e.target.value; // Update the number in the contact data
        setContactData(newData);
        setIsChanged(true)
    };

    // Handle title selection in dropdown
    const handleTitleChange = (e: React.ChangeEvent<HTMLSelectElement>, index: number) => {
        const newData = structuredClone(contactData);
        newData[index].title = e.target.value; // Set the selected title
        setContactData(newData);
        setIsChanged(true);
    };

    // Handle add new item
    const handleAddNewItem = () => {
        if (contactData.length < 4) {
            setContactData([...contactData, { title: "", number: "" }]);
            setIsChanged(true);
        }
    };

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setContactData(structuredClone(emergencyContacts))
        setIsChanged(false); // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        updateCountryField(country, contactData, "emergencyContacts", "Emergency contacts").then(() => {
            setIsChanged(false); // Reset action in progress
        })
    };

    return (
        <div className="table-margins">
            {!!contactData.length ? (
                <table className="card-table">
                    <thead>
                        <tr className="card-table-head">
                            <th>Title</th>
                            <th>Emergency Number</th>
                        </tr>
                    </thead>
                    <tbody>
                        {contactData.map((contact, index) => (
                            <tr key={index} className="card-table-row text-lg sm:text-xl">
                                <td className="p-4">
                                    {contact.title !== "" ? (
                                        contact.title
                                    ) : (
                                        <select
                                            value={contact.title}
                                            onChange={(e) => handleTitleChange(e, index)}
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
                                        onChange={(e) => handleInputChange(e, index)}
                                        className="w-full p-2 border text-xl bg-[#F1F1E6]"
                                    />
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
                        className="flex text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center"
                        onClick={handleAddNewItem}
                    >
                        <i className="fa fa-plus"></i> Add a new emergency number
                    </button>
                </div>
            )}

            {/* Reusable Footer Component */}
            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    );
};

export default EmergencyContacts;
