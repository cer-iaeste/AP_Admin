import React from "react";
import { useNavigate } from "react-router-dom";
import { confirmModalWindow } from "./Global"

interface BackProps {
    banner?: boolean
    confirmationNeeded?: boolean
}

const Back: React.FC<BackProps> = ({ confirmationNeeded, banner }) => {
    const navigate = useNavigate();

    const handleBack = async () => {
        console.log(confirmationNeeded)
        if (!confirmationNeeded) navigate(-1)
        else {
            const confirmation = await confirmModalWindow("All unsaved changes will be lost");
            if (confirmation) navigate(-1)
        }
    }

    return (
        <button
            onClick={handleBack}
            className={`absolute top-4 ${banner ? "left-4" : "left-0"}  z-100 px-4 py-2 bg-blue-500 text-white rounded-full shadow-md cursor-pointer hover:bg-blue-700 transition-all duration-200 flex items-center gap-2 text-base focus:outline-none focus:ring-2 focus:ring-blue-400`}
            title="Go back to countries list"
        >
            <i className="fa-solid fa-arrow-left"></i>
            <span className="hidden sm:inline">Back</span>
        </button>
    )
}

export default Back;