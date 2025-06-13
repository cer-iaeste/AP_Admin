import React, { useState, useEffect, useCallback } from "react";
// CardFooter is no longer needed in this component
// import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css" // Keep this if it contains global styles you need
import { CardProps } from "../../global/Global"; // Assuming CardProps, handleInputChange are correctly defined
import { SocialLinkType } from "../../types/types"; // Assuming SocialLinkType has name, icon, value
// import Back from "../../global/Back"; // Removed Back component import
import { toast } from 'react-toastify'; // Import toast for notifications

interface SocialLinksProps extends CardProps {
    socialLinks: SocialLinkType[]; // Initial data for social links
    // 'save' and 'cancel' boolean props are removed as SocialLinks will manage its own save/cancel
    handleChange: (changed: boolean) => void; // Callback to parent to update its 'cardChange' state (e.g., setCardChange)
}

// Define the initial structure of social links for consistent mapping
const initialLinksStructure: SocialLinkType[] = [
    { name: 'Instagram', icon: 'fab fa-instagram', value: '' },
    { name: 'Facebook', icon: 'fab fa-facebook', value: '' },
    { name: 'Website', icon: 'fas fa-globe', value: '' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', value: '' },
    { name: 'Email Address', icon: 'fas fa-envelope', value: '' },
];

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, country, handleSave, handleInputChange, handleChange }) => { // handleBack removed from destructuring
    const [isChanged, setIsChanged] = useState(false);
    const [links, setLinks] = useState<SocialLinkType[]>(initialLinksStructure);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator on save/cancel

    const mapLinks = useCallback(
        (currentSocialLinks: SocialLinkType[]): SocialLinkType[] => {
            return initialLinksStructure.map(link => ({
                ...link,
                value: currentSocialLinks?.find(sl => sl.name === link.name)?.value ?? ''
            }));
        },
        []
    );

    // Effect to initialize links state when socialLinks prop changes
    useEffect(() => {
        setLinks(mapLinks(socialLinks));
        if (handleChange) handleChange(false); // Reset parent's change indicator
        setIsChanged(false); // Reset component's own change indicator
    }, [socialLinks, mapLinks, handleChange]);

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        const hasChanges = links.some(link => {
            const originalLink = socialLinks.find(sl => sl.name === link.name);
            return originalLink ? originalLink.value !== link.value : link.value !== '';
        });
        setIsChanged(hasChanges);
        // Also update parent's cardChange state
        if (handleChange) {
            handleChange(hasChanges);
        }
    }, [links, socialLinks, handleChange]);


    // Handler for saving changes to social links - Directly triggered by button
    const onSave = async () => {
        setIsLoading(true); // Start loading
        const socialLinksToSave = links.filter(link => link.value !== '').map(link => ({
            name: link.name,
            value: link.value
        }));

        try {
            await handleSave(country, socialLinksToSave, "socialLinks", "Social links", setIsChanged);
            toast.success("Social links saved successfully!");
            // `setIsChanged(false)` and `handleChange(false)` will be handled by the useEffect watching `links` and `socialLinks`.
        } catch (error) {
            console.error("Error saving social links:", error);
            toast.error("Failed to save social links.");
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Handler for canceling changes - Directly triggered by button
    const onCancel = async () => {
        setIsLoading(true); // Start loading
        const confirmation = await window.confirm("All unsaved changes will be lost. Are you sure?"); // Using window.confirm as per common React patterns for this context

        if (confirmation) {
            setLinks(mapLinks(socialLinks)); // Reset local links state to initial prop values
            // `setIsChanged(false)` and `handleChange(false)` will be handled by the useEffect watching `links` and `socialLinks`.
            toast.info("Changes discarded.");
        } else {
            toast.info("Cancellation aborted.");
        }
        setIsLoading(false); // End loading
    };

    // Handler for input changes in individual social link fields
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        handleInputChange(setLinks, links, index, e.target.value, setIsChanged, 'value');
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
        < div className="bg-white p-6 rounded-xl shadow-lg border border-gray-200 flex flex-col space-y-6 mt-8" > {/* Main card container */}
            {
                links.map((link, index) =>
                    <div key={index} className={`
                            flex flex-row items-center gap-x-3 p-2 rounded-lg // Flex row, centered items, reduced gap and padding
                            transition-colors duration-200 // Smooth transition for hover
                            ${index < links.length - 1 ? 'border-b border-gray-100 pb-4' : ''} // Add border-bottom except for last item
                        `}>
                        <label htmlFor={`link-${link.name.replace(/\s+/g, '-')}`} className="
                                flex-shrink-0 // Prevent label from shrinking
                                text-lg font-semibold text-gray-700 flex items-center gap-x-2 // Consistent styling
                                sm:w-auto // Adjust width
                            ">
                            <i className={`${link.icon} text-2xl text-blue-600`} /> {/* Vibrant icon */}
                            <span className="hidden sm:block">{link.name}</span> {/* Hide name on mobile, show on sm and up */}
                        </label>
                        <input
                            id={`link-${link.name.replace(/\s+/g, '-')}`} // Unique ID for label 'for' attribute
                            type="text"
                            placeholder={`Enter ${link.name} URL`} // More specific placeholder
                            value={link.value}
                            onChange={(e) => onInputChange(e, index)}
                            className="
                                    text-input // Using the text-input class for consistent input styling
                                    w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-sky-500 text-gray-800 text-lg
                                "
                        />
                    </div>
                )
            }

            {/* Save and Cancel Buttons directly within the form */}
            <div className="flex justify-end space-x-4 pt-4">
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
        </div >
    );
};

export default SocialLinks;
