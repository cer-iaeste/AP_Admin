import React from "react";
import { handleLogout } from "../../global/Global";

interface LogoutProps {
    isMobile: boolean
}

const Logout: React.FC<LogoutProps> = ({isMobile}) => {
    return (
        <li
            onClick={handleLogout}
            className={`flex items-center cursor-pointer rounded-lg transition-colors duration-200 ease-in-out
                ${isMobile
                    ? 'flex-col py-1 px-1 text-xs justify-center flex-1' // Mobile item
                    : 'flex-row py-3 px-4 text-lg justify-center sm:justify-start mt-auto' // Desktop item, mt-auto pushes it to bottom
                }
                text-gray-700 hover:text-blue-800 border border-transparent hover:border-blue-800 bg-white
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