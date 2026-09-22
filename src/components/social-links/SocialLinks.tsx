import React, { useContext, useEffect, useMemo, useState } from "react";
import "../summer-reception/Weekend.css";
import { CardFormType, SocialsType } from "../../types/types";
import CardContext from "../card/CardContext";
import { SOCIAL_LINKS_CONSTANTS } from "../../global/Global";
import FormButtons from "../card/FormButtons";
import LinkTypeModal from "./LinkTypeModal";
import { toast } from "react-toastify";
import AddBtn from "../card/Add";

interface SocialsProps {
    socials: SocialsType[];
}

const createTemplateLinks = (): CardFormType[] =>
    SOCIAL_LINKS_CONSTANTS.map(link => ({ ...link, value: "" }));

const mapLinks = (links: CardFormType[]): CardFormType[] =>
    SOCIAL_LINKS_CONSTANTS.map(template => ({
        ...template,
        value: links.find(link => link.name === template.name)?.value ?? ""
    }));

const mapSocials = (socials: SocialsType[], countryName: string): SocialsType[] =>
    socials.length > 0
        ? socials.map(social => ({ ...social, links: mapLinks(social.links) }))
        : [{ committee: countryName, links: createTemplateLinks() }];

const SocialLinks: React.FC<SocialsProps> = ({ socials }) => {
    const context = useContext(CardContext);
    const countryName = context?.countryName ?? "";
    const setIsChanged = context?.setIsChanged;
    const [socialsData, setSocialsData] = useState<SocialsType[]>([]);
    const [selectedSocial, setSelectedSocial] = useState<SocialsType | null>(null);
    const [selectedIndex, setSelectedIndex] = useState<number | null>(null);
    const [isSelectedNc, setIsSelectedNc] = useState(false);
    const [isEditMode, setIsEditMode] = useState(false);

    const mappedSocials = useMemo(
        () => mapSocials(socials, countryName),
        [socials, countryName]
    );

    useEffect(() => {
        setSocialsData(structuredClone(mappedSocials));
        setIsChanged?.(false);
    }, [mappedSocials, setIsChanged]);

    useEffect(() => {
        setIsChanged?.(JSON.stringify(socialsData) !== JSON.stringify(mappedSocials));
    }, [socialsData, mappedSocials, setIsChanged]);

    if (!context) return null;

    const { handleSave, handleDelete, handleCancel, isChanged, isLoading } = context;

    const closePopup = () => {
        setSelectedSocial(null);
        setSelectedIndex(null);
    };

    const openPopup = (social: SocialsType, index: number | null, isNc: boolean) => {
        setSelectedSocial(structuredClone(social));
        setSelectedIndex(index);
        setIsSelectedNc(isNc);
        setIsEditMode(index !== null);
    };

    const handleSaveSocial = (social: SocialsType) => {
        setSocialsData(current => {
            if (selectedIndex === null) return [...current, social];
            return current.map((item, index) => index === selectedIndex ? social : item);
        });
        closePopup();
        toast.success(`Social links for "${social.committee}" updated. Click "Save" to apply changes.`);
    };

    const onSave = () => {
        const dataToSave = socialsData
            .filter(social => social.committee.trim() !== "")
            .map(social => ({
                committee: social.committee.trim(),
                links: social.links
                    .filter(link => link.value.trim() !== "")
                    .map(({ name, value }) => ({ name, value: value.trim() }))
            }));

        handleSave(countryName, dataToSave, "socials", "Social links");
    };

    const onCancel = async () => {
        const cancelled = await handleCancel(setSocialsData, mappedSocials);
        if (cancelled) toast.info("Changes discarded.");
    };

    const onDelete = async (index: number) => {
        const deleted = await handleDelete(index, setSocialsData, socialsData);
        if (deleted) toast.info("Social links removed.");
    };

    return (
        <section className="my-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {socialsData.map((social, index) => (
                    <div
                        key={`${social.committee}-${index}`}
                        className="bg-sky-50 p-6 rounded-2xl shadow-xl border border-blue-100 flex flex-col min-h-72 transition-all duration-300 transform hover:scale-103 hover:shadow-2xl"
                    >
                        <div className="flex justify-between items-center pb-2 mb-4 border-b-2 border-blue-200 text-base md:text-xl font-bold text-gray-800">
                            <span className="truncate pr-2">
                                {index === 0 ? `NC ${social.committee}` : `LC ${social.committee}`}
                            </span>
                            <div className="flex items-center gap-2">
                                <button
                                    type="button"
                                    onClick={() => openPopup(social, index, index === 0)}
                                    className="w-8 h-8 rounded-full bg-blue-100 text-blue-600 flex items-center justify-center hover:bg-blue-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    title="Edit social links"
                                >
                                    <i className="fa fa-pencil-alt text-base" aria-hidden="true" />
                                </button>
                                {index !== 0 && (
                                    <button
                                        type="button"
                                        onClick={() => onDelete(index)}
                                        className="w-8 h-8 rounded-full bg-blue-100 text-red-600 flex items-center justify-center hover:bg-red-600 hover:text-white transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-red-500"
                                        title="Remove social links"
                                    >
                                        <i className="fa fa-trash text-base" aria-hidden="true" />
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-col flex-1 space-y-3 text-gray-700 text-base md:text-lg font-semibold">
                            {social.links.filter(link => link.value).map(link => (
                                <div key={link.name} className="flex items-center gap-3">
                                    <i className={`${link.icon ?? "fa-solid fa-link"} text-blue-500 w-5`} aria-hidden="true" />
                                    <span className="truncate" title={link.value}>{link.name}: {link.value}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))}

                <AddBtn onAdd={() => openPopup(
                    { committee: "", links: createTemplateLinks() },
                    null,
                    false
                )} />
            </div>

            <FormButtons
                isChanged={isChanged}
                isLoading={isLoading}
                onCancel={onCancel}
                onSave={onSave}
            />

            {selectedSocial && (
                <LinkTypeModal
                    selectedSocial={selectedSocial}
                    isNc={isSelectedNc}
                    isEditMode={isEditMode}
                    onClose={closePopup}
                    onSave={handleSaveSocial}
                />
            )}
        </section>
    );
};

export default SocialLinks;
