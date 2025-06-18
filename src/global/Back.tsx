import React from "react";
import { useNavigate } from "react-router-dom";
import { confirmModalWindow } from "./Global"

interface BackProps {
    banner?: boolean
    confirmationNeeded?: boolean
    isMobile?: boolean
    countryName?: string
}

const Back: React.FC<BackProps> = ({ confirmationNeeded, banner, isMobile, countryName }) => {
    const navigate = useNavigate();

    const handleBack = async () => {
        const goBack = () => {
            window.scrollTo({ top: 0, left: 0 })
            navigate(-1)
        }
        if (!confirmationNeeded) goBack()
        else {
            const confirmation = await confirmModalWindow("All unsaved changes will be lost");
            if (confirmation) goBack()
        }
    }

    return (
        isMobile ? (
            <button onClick={handleBack} className="text-blue-500 z-100 cursor-pointer flex items-center gap-2">
                <i className="fa-solid fa-arrow-left"></i>
            </button>
        ) : (
            <button
                onClick={handleBack}
                className={`absolute top-4 ${banner ? "left-4" : "left-0"}  z-100 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
            >
                <i className="fa-solid fa-arrow-left"></i>
                <span className="hidden sm:inline">{countryName ?? "Back"}</span>
            </button>
        )
    )
}

export default Back;