import React from "react";
import { handleLogout } from "../../global/Global";

interface LogoutProps {
    isMobile: boolean
}

const Logout: React.FC<LogoutProps> = ({ isMobile }) => {
    return (
        <li key="logout"
            onClick={handleLogout}
            className={`flex items-center cursor-pointer transition-all duration-200 ease-in-out
                ${isMobile
                    ? 'flex-col text-xs justify-center flex-1 h-10 hover:text-[#d54c55]' // Mobile item
                    : 'flex-row py-3 px-4 text-lg justify-center sm:justify-start mt-auto rounded-lg hover:from-blue-700 hover:to-purple-700 hover:scale-105' // Desktop item, mt-auto pushes it to bottom
                }
                bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-md
            `}
            title="Log out"
        >
            <i className="fa-solid fa-right-from-bracket text-xl" /> {/* Icon styling */}
            <span className={`${isMobile ? 'hidden' : 'inline ml-3 font-semibold'}`}>
                Log Out
            </span>
        </li>
    )
}

export default Logout