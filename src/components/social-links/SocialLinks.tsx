import React, { useState, useEffect, useCallback } from "react";
import "../summer-reception/Weekend.css"
import { CardProps } from "../../global/Global"; 
import { CardFormType } from "../../types/types";
import { toast } from 'react-toastify';
import CardForm from "../../global/Form";

interface SocialLinksProps extends CardProps {
    socialLinks: CardFormType[]; // Initial data for social links
    // 'save' and 'cancel' boolean props are removed as SocialLinks will manage its own save/cancel
    handleChange: (changed: boolean) => void; // Callback to parent to update its 'cardChange' state (e.g., setCardChange)
}

// Define the initial structure of social links for consistent mapping
const initialLinksStructure: CardFormType[] = [
    { name: 'Instagram', icon: 'fab fa-instagram', value: '' },
    { name: 'Facebook', icon: 'fab fa-facebook', value: '' },
    { name: 'Website', icon: 'fas fa-globe', value: '' },
    { name: 'WhatsApp', icon: 'fab fa-whatsapp', value: '' },
    { name: 'Email Address', icon: 'fas fa-envelope', value: '' },
];

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, country, handleSave, handleInputChange, handleChange }) => { // handleBack removed from destructuring
    const [isChanged, setIsChanged] = useState(false);
    const [links, setLinks] = useState<CardFormType[]>(initialLinksStructure);
    const [isLoading, setIsLoading] = useState(false); // New state for loading indicator on save/cancel

    const mapLinks = useCallback(
        (currentSocialLinks: CardFormType[]): CardFormType[] => {
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
    const onSave = () => {
        setIsLoading(true); // Start loading
        const socialLinksToSave = links.filter(link => link.value !== '').map(link => ({
            name: link.name,
            value: link.value
        }));

        try {
            handleSave(country, socialLinksToSave, "socialLinks", "Social links", setIsChanged);
            toast.success("Social links saved successfully!");
            // `setIsChanged(false)` and `handleChange(false)` will be handled by the useEffect watching `links` and `socialLinks`.
        } catch (error) {
            console.error("Error saving social links:", error);
            toast.error("Failed to save social links.");
        } finally {
            setIsLoading(false); // End loading
        }
    };

    // Handler for input changes in individual social link fields
    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        handleInputChange(setLinks, links, index, e.target.value, setIsChanged, 'value');
    };

    return (
        <CardForm items={links} onInputChange={onInputChange} isLoading={isLoading} isChanged={isChanged} onSave={onSave} />
    );
};

export default SocialLinks;
