import React, { useEffect, useState } from "react";
import cerLogo from "../../images/cer-logo.png";
import cerLogoSmall from "../../images/logo-small.jpg";
import "../../App.css" // Keep this if it contains global styles you need
import { useNavigate, useParams } from "react-router-dom";
import { SIDEBAR_SECTIONS } from "../../global/Global"; // Assuming SIDEBAR_SECTIONS structure
import useWindowSize from "../../hooks/useScreenSize" // Assuming useWindowSize hook exists
import Logout from "./Logout";

const Sidebar = () => {
    const [selectedSection, setSelectedSection] = useState<number>(-1);
    const navigate = useNavigate();
    const params = useParams();
    const { width } = useWindowSize(); // Get current window width

    const isMobile = width <= 1023;

    const handleSelectSection = (link: string, index: number): void => {
        setSelectedSection(index);
        navigate(link);
    };

    const resetSidebar = (): void => {
        setSelectedSection(-1);
        navigate(''); // Navigate to the root path (dashboard/landing)
    };

    // Effect to update selected section based on current URL parameters
    useEffect(() => {
        // Get the wildcard parameter from the URL (e.g., "/countries" -> "countries")
        const currentPathSegment = params['*'];
        // Find the index of the section whose link matches the current path segment (after stripping leading slash)
        const mainLink = currentPathSegment?.split("/")[0] ?? -1
        const foundIndex = SIDEBAR_SECTIONS.findIndex(ss => ss.link.replace(/^\//, '') === mainLink);
        setSelectedSection(foundIndex !== -1 ? foundIndex : -1);
    }, [params]); // Depend on params to react to URL changes

    return (
        <section
            className={`
                fixed z-30 bg-stone-50 border-gray-200 shadow-xl 
                ${isMobile
                    ? 'bottom-0 left-0 right-0 h-10 w-full flex flex-row items-center justify-around'
                    // Desktop-specific styles: static vertical sidebar, dynamic width based on isOpen, vertical flex
                    : `top-0 left-0 h-screen w-60 translate-x-0 flex-col justify-start border-r rounded-r-xl px-2`
                }
                transition-all duration-300 ease-in-out // Smooth transitions for desktop sidebar sliding
            `}
        >
            {/* Logo Section - only visible on desktop */}
            {!isMobile && (
                <div key="admin-logo" className="bg-white m-2 rounded-xl border hover:border-blue-800flex items-center justify-center">
                    <button
                        onClick={resetSidebar}
                        className="p-2 rounded-lg transition-transform transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-sky-500"
                        title="Go to Dashboard"
                    >
                        {/* Use full logo when sidebar is open, small logo when collapsed */}
                        <img alt="CER Summer App" className="h-16 w-auto" src={cerLogo} />
                    </button>
                </div>
            )}

            {/* Navigation List */}
            <ul className={`
                flex-1 w-full
                ${isMobile
                    ? 'flex flex-row justify-around' // Mobile: horizontal, space-around
                    : 'flex flex-col pt-2 space-y-4 px-2' // Desktop: vertical, spaced
                }
            `}>
                {SIDEBAR_SECTIONS.map((section, index) =>
                    <li
                        key={index}
                        onClick={() => handleSelectSection(section.link, index)}
                        className={`
                            flex items-center cursor-pointer transition-colors duration-200 ease-in-out bg-white border-t-4
                            ${isMobile
                                ? 'flex-col py-1 px-1 text-xs justify-center flex-1'
                                : 'flex-row py-3 px-4 text-lg justify-center sm:justify-start rounded-lg'
                            }
                            ${selectedSection === index
                                ? 'border-blue-400'
                                : 'text-gray-700 hover:text-blue-800 border border-transparent hover:border-blue-800'
                            }
                        `}
                    >
                        <i className={`${section.icon} text-xl ${isMobile ? 'mb-1' : ''}`} /> {/* Icon styling */}
                        {/* Section name - hidden on mobile, inline on desktop (with optional collapse) */}
                        <span className={`${isMobile ? 'hidden' : 'inline'} ml-3 font-semibold`}>
                            {section.name}
                        </span>
                    </li>
                )}

                <Logout isMobile={isMobile} />
            </ul>
        </section>
    );
};

export default Sidebar;
