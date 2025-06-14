import React, { useState, useEffect, useCallback } from "react";
import { EmergencyContactsType, CardFormType } from "../../types/types";
import "../card/Card.css" // Keep this if it contains global styles you need
import { CardProps } from "../../global/Global"; // Assuming CardProps and handleInputChange are defined
import Back from "../../global/Back"; // Import the Back component
import { toast } from 'react-toastify'; // Import toast for notifications
import CardForm from "../../global/Form";

interface EmergencyContactsProps extends CardProps {
    emergencyContacts: CardFormType[] // Initial data for emergency contacts
}

// Define initial contact structure for consistent mapping, now including icons
const initialContactsStructure: CardFormType[] = [
    { name: 'Police', value: '', icon: 'fa-solid fa-handcuffs' },
    { name: 'Ambulance', value: '', icon: 'fa-solid fa-truck-medical' },
    { name: 'Fire Dpt.', value: '', icon: 'fa-solid fa-fire-extinguisher' },
    { name: 'Emergency Line', value: '', icon: 'fa-solid fa-phone' },
];

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts, country, handleSave, handleCancel, handleInputChange }) => {
    const [contactData, setContactData] = useState<CardFormType[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator on save/cancel

    // Memoize the mapping function to avoid unnecessary re-renders
    const mapContactData = useCallback(
        (currentEmergencyContacts: CardFormType[]): CardFormType[] => {
            return initialContactsStructure.map(contact => ({
                ...contact,
                value: currentEmergencyContacts?.find(cem => cem.name === contact.name)?.value ?? ""
            }))
        },
        [] // No dependencies, as initialContactsStructure is constant
    );

    // Effect to initialize contactData state when emergencyContacts prop changes
    useEffect(() => {
        setContactData(mapContactData(emergencyContacts));
        setIsChanged(false); // Reset changed status on initial load or prop update
    }, [emergencyContacts, mapContactData]);

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        const hasChanges = contactData.some(contact => {
            const originalContact = emergencyContacts.find(ec => ec.name === contact.name);
            return originalContact ? originalContact.value !== contact.value : contact.value !== '';
        });
        setIsChanged(hasChanges);
        // If you have a handleChange prop from the parent to update a shared state, call it here:
        // if (handleChange) handleChange(hasChanges);
    }, [contactData, emergencyContacts]); // Add `emergencyContacts` to dependencies

    // Handler for saving changes
    const onSave = async () => {
        setIsLoading(true); // Start loading
        // Filter out contacts with empty values if you don't want to save them
        const result = contactData.filter(contact => contact.value !== "");

        try {
            await handleSave(country, result, "emergencyContacts", "Emergency contacts", setIsChanged);
            toast.success("Emergency contacts saved successfully!");
            // setIsChanged(false) will be handled by the useEffect watching `contactData` and `emergencyContacts`.
        } catch (error) {
            console.error("Error saving emergency contacts:", error);
            toast.error("Failed to save emergency contacts.");
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Handler for canceling changes
    const onCancel = async () => {
        setIsLoading(true); // Start loading
        const confirmation = await window.confirm("All unsaved changes will be lost. Are you sure?");

        if (confirmation) {
            setContactData(mapContactData(emergencyContacts)); // Reset local state to original props
            // setIsChanged(false) will be handled by the useEffect watching `contactData` and `emergencyContacts`.
            toast.info("Changes discarded.");
        } else {
            toast.info("Cancellation aborted.");
        }
        setIsLoading(false); // End loading
    };

    // Handler for input changes in individual contact fields
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        handleInputChange(setContactData, contactData, index, e.target.value, setIsChanged, 'value');
    };

    // Handler for the Back button, reusing parent's handleBack logic if available
    const onBack = () => {
        // Assuming CardProps might include a handleBack function from the parent
        // if (handleBack) {
        //     handleBack(isChanged); // Pass isChanged to parent's handleBack for confirmation
        // }
        // If handleBack is not passed, or if we want local navigation:
        // navigate('/countries'); // Or navigate('/countries/' + countryName);
        console.log("Back button clicked - implement navigation logic or pass a prop from parent.");
        // For now, no specific navigation as handleBack prop is not available in the provided context
    };

    // Base button classes for consistent styling
    const baseButtonClasses = `
        flex items-center justify-center
        px-4 py-2 rounded-lg text-lg font-semibold
        transition-all duration-200 ease-in-out
        transform hover:scale-105 focus:outline-none focus:ring-2
    `;

    // Classes for disabled state
    const disabledButtonClasses = `
        bg-gray-200 text-gray-400 cursor-not-allowed
    `;

    return (
        <CardForm items={contactData} onInputChange={onInputChange} isLoading={isLoading} isChanged={isChanged} onSave={onSave} />
    );
};

export default EmergencyContacts;
