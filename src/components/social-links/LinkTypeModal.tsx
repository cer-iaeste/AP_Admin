import React, { useEffect, useState } from "react";
import { SocialsType } from "../../types/types";

interface LinkTypeModalProps {
    selectedSocial: SocialsType;
    isNc: boolean;
    isEditMode: boolean;
    onClose: () => void;
    onSave: (social: SocialsType) => void;
}

const LinkTypeModal: React.FC<LinkTypeModalProps> = ({ selectedSocial, isNc, isEditMode, onClose, onSave }) => {
    const [socialData, setSocialData] = useState<SocialsType>(() => structuredClone(selectedSocial));

    useEffect(() => {
        setSocialData(structuredClone(selectedSocial));
    }, [selectedSocial]);

    useEffect(() => {
        const handleEscape = (event: KeyboardEvent) => {
            if (event.key === "Escape") onClose();
        };

        document.addEventListener("keydown", handleEscape);
        return () => document.removeEventListener("keydown", handleEscape);
    }, [onClose]);

    const updateLink = (index: number, value: string) => {
        setSocialData(current => ({
            ...current,
            links: current.links.map((link, linkIndex) =>
                linkIndex === index ? { ...link, value } : link
            )
        }));
    };

    const handleSubmit = () => {
        if (!socialData.committee.trim()) return;
        onSave({ ...socialData, committee: socialData.committee.trim() });
    };

    const isValid = socialData.committee.trim().length > 0;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center p-4 z-50">
            <div className="relative bg-white rounded-2xl shadow-2xl border border-gray-200 w-full max-w-2xl max-h-[90vh] flex flex-col">
                <div className="bg-blue-600 text-white p-4 rounded-t-2xl flex justify-between items-center flex-shrink-0">
                    <span className="text-2xl font-bold">
                        {isEditMode ? "Edit Social Links" : "Add Social Links"}
                    </span>
                    <button type="button" onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors duration-200" title="Close">
                        <i className="fa-solid fa-x text-white" aria-hidden="true" />
                    </button>
                </div>

                <div className="w-full p-6 bg-white text-gray-800 overflow-y-auto flex-grow space-y-5">
                    <div className="flex flex-col space-y-1">
                        <label htmlFor="committee" className="text-base font-semibold text-gray-700">
                            {isNc ? "National Committee" : "Local Committee"}
                        </label>
                        <input
                            id="committee"
                            type="text"
                            value={socialData.committee}
                            onChange={event => setSocialData(current => ({ ...current, committee: event.target.value }))}
                            disabled={isNc}
                            placeholder="Committee name"
                            className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:bg-gray-100 disabled:text-gray-500"
                        />
                    </div>

                    {socialData.links.map((link, index) => (
                        <div key={link.name} className="flex flex-col space-y-1">
                            <label htmlFor={`social-link-${index}`} className="text-base font-semibold text-gray-700 flex items-center gap-2">
                                <i className={`${link.icon ?? "fa-solid fa-link"} text-blue-500`} aria-hidden="true" />
                                {link.name}
                            </label>
                            <input
                                id={`social-link-${index}`}
                                type={link.name === "Email Address" ? "email" : "text"}
                                value={link.value}
                                onChange={event => updateLink(index, event.target.value)}
                                placeholder={`Enter ${link.name.toLowerCase()}`}
                                className="w-full p-3 border border-gray-300 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                        </div>
                    ))}
                </div>

                <footer className="bg-gray-100 p-4 border-t border-gray-200 flex justify-end space-x-4 flex-shrink-0 rounded-b-2xl">
                    <button type="button" onClick={onClose} className="px-6 py-2 rounded-lg font-semibold bg-red-500 text-white hover:bg-red-600 transition-colors duration-200">
                        Cancel
                    </button>
                    <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={!isValid}
                        className={`px-6 py-2 rounded-lg font-semibold transition-colors duration-200 ${isValid ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-300 text-gray-500 cursor-not-allowed"}`}
                    >
                        Save Changes
                    </button>
                </footer>
            </div>
        </div>
    );
};

export default LinkTypeModal;
