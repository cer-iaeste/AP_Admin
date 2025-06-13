import React, { useState, useEffect, useCallback } from "react";
import { EmergencyContactsType } from "../../types/types";
import "../card/Card.css" // Keep this if it contains global styles you need
import { CardProps } from "../../global/Global"; // Assuming CardProps and handleInputChange are defined
import Back from "../../global/Back"; // Import the Back component
import { toast } from 'react-toastify'; // Import toast for notifications

interface EmergencyContactsProps extends CardProps {
    emergencyContacts: EmergencyContactsType[] // Initial data for emergency contacts
}

// Define initial contact structure for consistent mapping, now including icons
const initialContactsStructure: EmergencyContactsType[] = [
    { title: 'Police', number: '', icon: 'fa-solid fa-handcuffs' },
    { title: 'Ambulance', number: '', icon: 'fa-solid fa-truck-medical' },
    { title: 'Fire Department', number: '', icon: 'fa-solid fa-fire-extinguisher' },
    { title: 'Emergency Line', number: '', icon: 'fa-solid fa-phone' },
];

const EmergencyContacts: React.FC<EmergencyContactsProps> = ({ emergencyContacts, country, handleSave, handleCancel, handleInputChange }) => {
    const [contactData, setContactData] = useState<EmergencyContactsType[]>([]);
    const [isChanged, setIsChanged] = useState(false);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator on save/cancel

    // Memoize the mapping function to avoid unnecessary re-renders
    const mapContactData = useCallback(
        (currentEmergencyContacts: EmergencyContactsType[]): EmergencyContactsType[] => {
            if (!currentEmergencyContacts || currentEmergencyContacts.length === 0) {
                return initialContactsStructure;
            }

            // Create a deep copy of the incoming contacts to ensure immutability
            const contactsCopy = structuredClone(currentEmergencyContacts);

            return initialContactsStructure.map(initialContact => ({
                ...initialContact,
                // Find existing contact by title and use its number, otherwise default to empty
                number: contactsCopy.find((c: EmergencyContactsType) => c.title === initialContact.title)?.number ?? ''
            }));
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
            const originalContact = emergencyContacts.find(ec => ec.title === contact.title);
            return originalContact ? originalContact.number !== contact.number : contact.number !== '';
        });
        setIsChanged(hasChanges);
        // If you have a handleChange prop from the parent to update a shared state, call it here:
        // if (handleChange) handleChange(hasChanges);
    }, [contactData, emergencyContacts]); // Add `emergencyContacts` to dependencies

    // Handler for saving changes
    const onSave = async () => {
        setIsLoading(true); // Start loading
        // Filter out contacts with empty numbers if you don't want to save them
        const result = contactData.filter(contact => contact.number !== "");

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
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number, column: string) => {
        // Assuming handleInputChange is designed to work with an array of objects
        const updatedContactData = [...contactData];
        (updatedContactData[index] as any)[column] = e.target.value; // Type assertion as 'column' is dynamic
        setContactData(updatedContactData);
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
        <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col space-y-6"> {/* Main card container */}
            {contactData.map((contact, index) => (
                <div key={index} className="flex flex-row items-center gap-x-3"> {/* Changed to flex-row and items-center */}
                    {/* Icon before the label */}
                    <i className={`${contact.icon} text-2xl text-blue-600 flex-shrink-0`} />

                    <label htmlFor={`contact-${contact.title.replace(/\s+/g, '-')}`} className="
                                text-lg font-semibold text-gray-700 flex-shrink-0 // Flex-shrink-0 to prevent shrinking
                                hidden sm:block // Hide label on mobile, show on small screens and up
                            ">
                        {contact.title}
                    </label>
                    <input
                        id={`contact-${contact.title.replace(/\s+/g, '-')}`} // Unique ID for label 'for' attribute
                        type="text" // Use "tel" if you want phone-specific keyboard on mobile
                        placeholder={`Enter ${contact.title} number`}
                        value={contact.number}
                        onChange={(e) => onInputChange(e, index, "number")}
                        className="
                                    flex-1 // Input takes remaining space
                                    p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-lg
                                "
                    />
                </div>
            ))}

            {/* Save and Cancel Buttons directly within the form */}
            <div className="flex justify-end space-x-4 pt-4 border-t border-gray-200">
                {/* Cancel Button */}
                <button
                    type="button"
                    disabled={!isChanged || isLoading}
                    onClick={onCancel}
                    className={`${baseButtonClasses}
                                ${!isChanged || isLoading
                            ? disabledButtonClasses
                            : 'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500'
                        }
                            `}
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <i className={`fa fa-ban mr-2`} aria-hidden="true"></i>
                    )}
                    <span>Cancel</span>
                </button>

                {/* Save Button */}
                <button
                    type="button"
                    disabled={!isChanged || isLoading}
                    onClick={onSave}
                    className={`${baseButtonClasses}
                                ${!isChanged || isLoading
                            ? disabledButtonClasses
                            : 'bg-[#1B75BB] text-white hover:bg-[#155A90] focus:ring-[#1B75BB]'
                        }
                            `}
                >
                    {isLoading ? (
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                    ) : (
                        <i className={`fa fa-save mr-2`} aria-hidden="true"></i>
                    )}
                    <span>Save</span>
                </button>
            </div>
        </div>
    );
};

export default EmergencyContacts;
