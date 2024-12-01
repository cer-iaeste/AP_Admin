import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { EmergencyContactsType } from "../../types/types";
import "../card/Card.css"
import { CardProps, EMERGENCY_NUMBERS_CONSTANTS } from "../../global/Global";
import { title } from "process";

interface EmergencyContactsProps extends CardProps {
    emergencyContacts: EmergencyContactsType[]
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts, country, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [contactData, setContactData] = useState<EmergencyContactsType[]>([]);
    const [isChanged, setIsChanged] = useState(false)

    const mapContantData = (emergencyContacts: EmergencyContactsType[]): EmergencyContactsType[] => {
        const initialContants: EmergencyContactsType[] = [
            { title: 'Police', number: '' },
            { title: 'Ambulance', number: '' },
            { title: 'Fire Department', number: '' },
            { title: 'Emergency Line', number: '' },
        ]

        if (!emergencyContacts.length) return initialContants

        const contacts = structuredClone(emergencyContacts)

        return initialContants.map(contact => ({
            ...contact,
            number: contacts.find((c: EmergencyContactsType) => c.title === contact.title)?.number ?? ''
        }))
    }

    useEffect(() => {
        setContactData(mapContantData(emergencyContacts))
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

    const onSave = () => {
        const result = contactData.filter(contact => contact.number !== "")
        handleSave(country, result, "emergencyContacts", "Emergency contacts", setIsChanged)
    }
    const onCancel = () => handleCancel(isChanged, setContactData, mapContantData(emergencyContacts), setIsChanged)
    const onBack = () => handleBack(isChanged, setContactData, mapContantData(emergencyContacts), setIsChanged)
    const onInputChange = (e: any, index: number, column: string) => handleInputChange(setContactData, contactData, index, e.target.value, setIsChanged, column)

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mt-6 table-margins mx-2">
            {contactData.map((contact, index) => (
                <div key={index} className="card-container">
                    <div className="card-header">
                        {contact.title}
                    </div>
                    <input
                        placeholder={`${contact.title} number`}
                        value={contact.number}
                        onChange={(e) => onInputChange(e, index, "number")}
                        className="card-textarea"
                    />
                </div>
            ))}

            {/* Reusable Footer Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    );
};

export default EmergencyContacts;
