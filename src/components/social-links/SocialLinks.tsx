import React, { useState, useEffect, useCallback, useContext } from "react";
import "../summer-reception/Weekend.css"
import { CardFormType } from "../../types/types";
import CardForm from "../card/Form";
import CardContext from "../card/CardContext"
import { SOCIAL_LINKS_CONSTANTS } from "../../global/Global";

interface SocialLinksProps {
    socialLinks: CardFormType[];
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks }) => {
    const context = useContext(CardContext);
    const [mappedLinks, setMappedLinks] = useState<CardFormType[]>([])
    const [links, setLinks] = useState<CardFormType[]>([]);
    const [isLoading, setIsLoading] = useState(false);

    const mapLinks = useCallback(
        (currentSocialLinks: CardFormType[]): CardFormType[] => {
            return SOCIAL_LINKS_CONSTANTS.map(link => ({
                ...link,
                value: currentSocialLinks?.find(sl => sl.name === link.name)?.value ?? ''
            }));
        },
        []
    );

    useEffect(() => {
        setLinks(mappedLinks)
    }, [mappedLinks])

    useEffect(() => {
        setMappedLinks(mapLinks(socialLinks));
        setIsChanged(false);
    }, [socialLinks, mapLinks]);

    // Effect to check if changes have been made to enable the save button
    useEffect(() => {
        const hasChanges = links.some(link => {
            const originalLink = socialLinks.find(sl => sl.name === link.name);
            return originalLink ? originalLink.value !== link.value : link.value !== '';
        });
        setIsChanged(hasChanges);
    }, [links, socialLinks]);

    // Defensive check: ensure context is available
    if (!context) return null
    // Destructure required functions and countryName from context
    const { countryName, handleSave, handleInputChange, handleCancel, isChanged, setIsChanged } = context;

    // Handlers
    const onSave = () => {
        setIsLoading(true); // Start loading
        const socialLinksToSave = links.filter(link => link.value !== '').map(link => ({
            name: link.name,
            value: link.value
        }));

        try {
            handleSave(countryName, socialLinksToSave, "socialLinks", "Social links");
        } catch (error) {
            console.error("Error saving social links:", error);
        } finally {
            setIsLoading(false);
        }
    };

    const onCancel = () => handleCancel(setLinks, mappedLinks)

    const onInputChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        handleInputChange(setLinks, links, socialLinks, index, e.target.value, 'value');
    };

    return (
        <CardForm items={links} onInputChange={onInputChange} isLoading={isLoading} isChanged={isChanged} onSave={onSave} onCancel={onCancel} />
    );
};

export default SocialLinks;
