import React, { useState, useEffect, useCallback } from "react";
import CardFooter from "../card/CardFooter";
import "../summer-reception/Weekend.css"
import { CardProps } from "../../global/Global";
import { SocialLinkType } from "../../types/types";

interface SocialLinksProps extends CardProps {
    socialLinks: SocialLinkType[]
}

const SocialLinks: React.FC<SocialLinksProps> = ({ socialLinks, country, handleSave, handleCancel, handleBack, handleInputChange }) => {
    const [isChanged, setIsChanged] = useState(false)
    // links
    const [links, setLinks] = useState<SocialLinkType[]>([
        { name: 'Instagram', icon: 'fab fa-instagram', value: '' },
        { name: 'Facebook', icon: 'fab fa-facebook', value: '' },
        { name: 'Website', icon: 'fas fa-globe', value: '' },
        { name: 'WhatsApp', icon: 'fab fa-whatsapp', value: '' },
        { name: 'Email Address', icon: 'fas fa-envelope', value: '' },
    ])

    const mapLinks = useCallback(
        (socialLinks: SocialLinkType[]): SocialLinkType[] => {
            return links.map(link => ({
                ...link,
                value: socialLinks?.find(sl => sl.name === link.name)?.value ?? ''
            }));
        },
        [links] 
    );

    useEffect(() => {
        setLinks(mapLinks(socialLinks))
    }, [socialLinks, mapLinks])

    const onSave = async () => {
        // map social links
        const socialLinks = links.map(link => ({
            name: link.name,
            value: link.value
        }))
        // save changes 
        handleSave(country, socialLinks, "socialLinks", "Social links", setIsChanged)
    }

    const onCancel = async () => {
        const confirmation = await handleCancel(isChanged, setLinks, socialLinks, setIsChanged)
        if (confirmation) setLinks(mapLinks(socialLinks))
    }

    const onBack = () => handleBack(isChanged, setLinks, socialLinks, setIsChanged)
    const onInputChange = (e: any, index: number) => handleInputChange(setLinks, links, index, e.target.value, setIsChanged, 'value')

    return (
        <section>
            <div className="mt-6 table-margins mx-2 space-y-8">
                {/* Links */}
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {links.map((link, index) =>
                        <div key={index} className="card-container">
                            <div className="card-header">
                                <i className={`${link.icon} mr-1`} />
                                {link.name}
                            </div>
                            <input
                                placeholder="Link"
                                value={link?.value}
                                onChange={(e) => onInputChange(e, index)}
                                className="text-input underline text-sky-700"
                            />
                        </div>
                    )}
                </div>
            </div>

            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </section>
    );
};

export default SocialLinks;
