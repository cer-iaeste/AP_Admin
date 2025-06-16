import React, { useState, useEffect, useCallback, useContext } from "react";
import { EmergencyContactsType, CardFormType } from "../../types/types";
import "../card/Card.css"
import CardForm from "../card/Form";
import { EMERGENCY_CONTACTS_CONSTANTS } from "../../global/Global";
import CardContext from "../card/CardContext";

interface EmergencyContactsProps {
    emergencyContacts: EmergencyContactsType[] // Only specific data prop remains
}

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts }) => {
    const context = useContext(CardContext);
    
    // All useState, useCallback, useEffect hooks must be called unconditionally before any early returns
    const [mappedContacts, setMappedContacts] = useState<CardFormType[]>([])
    const [contactData, setContactData] = useState<CardFormType[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator on save/cancel

    // Memoize the mapping function to avoid unnecessary re-renders
    const mapContactData = useCallback(
        (currentEmergencyContacts: EmergencyContactsType[]): CardFormType[] => {
            return EMERGENCY_CONTACTS_CONSTANTS.map(initialItem => ({
                ...initialItem,
                value: currentEmergencyContacts.find(cem => cem.title === initialItem.name)?.number ?? ""
            }));
        },
        []
    );

    useEffect(() => {
        setContactData(mappedContacts)
    }, [mappedContacts])

    useEffect(() => {
        setMappedContacts(mapContactData(emergencyContacts))
        setIsChanged(false);
    }, [emergencyContacts, mapContactData]);

    useEffect(() => {
        const hasChanges = contactData.some(contact => {
            // Compare current local state `contact.value` with the original prop's `number`
            const originalContact = emergencyContacts.find(ec => ec.title === contact.name);
            return originalContact ? originalContact.number !== contact.value : contact.value !== '';
        });
        setIsChanged(hasChanges);
    }, [contactData, emergencyContacts]);

    // Defensive check after all hooks are called
    if (!context) return null; // Or throw an error, or render a fallback UI
    // Destructure required functions and countryName from context after the check
    const { countryName, handleSave, handleInputChange, handleCancel } = context;

    // Handlers
    const onSave = () => {
        setIsLoading(true);
        const result: EmergencyContactsType[] = contactData
            .map(contact => ({
                title: contact.name, 
                number: contact.value
            }));

        try {
            handleSave(countryName, result, "emergencyContacts", "Emergency contacts", setIsChanged);
        } catch (error) {
            console.error("Error saving emergency contacts:", error);
        } finally {
            setIsLoading(false); // End loading
        }
    };

    const onCancel = () => handleCancel(isChanged, setContactData, mappedContacts, setIsChanged)

    // Handler for input changes in individual contact fields
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) =>
        handleInputChange(setContactData, contactData, emergencyContacts, index, e.target.value, setIsChanged, 'value', 'number');

    return (
        <CardForm
            items={contactData}
            onInputChange={onInputChange}
            isLoading={isLoading}
            isChanged={isChanged}
            onSave={onSave}
            onCancel={onCancel}
        />
    );
};

export default EmergencyContacts;
