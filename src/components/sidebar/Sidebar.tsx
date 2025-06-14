import React, { useEffect, useState } from "react";
import cerLogo from "../../images/cer-logo.png";
import cerLogoSmall from "../../images/logo-small.jpg";
import "../../App.css" // Keep this if it contains global styles you need
import { useNavigate, useParams } from "react-router-dom";
import { SIDEBAR_SECTIONS } from "../../global/Global"; // Assuming SIDEBAR_SECTIONS structure
import AuthService from "../../service/AuthService"; // Assuming AuthService exists
import { toast } from 'react-toastify';
import useWindowSize from "../../hooks/useScreenSize" // Assuming useWindowSize hook exists

interface SidebarProps {
    isOpen: boolean,
    toggleSidebar: () => void // This prop primarily controls the desktop sidebar's open/close state
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [selectedSection, setSelectedSection] = useState<number>(-1);
    const navigate = useNavigate();
    const params = useParams();
    const { width } = useWindowSize(); // Get current window width

    const isMobile = width <= 1023;

    const handleSelectSection = (link: string, index: number): void => {
        setSelectedSection(index);
        // If not on mobile, and the sidebar is designed to toggle on click, call toggleSidebar
        if (!isMobile && isOpen) {
            // toggleSidebar(); // Uncomment if clicking a desktop sidebar item should close the sidebar
        }
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
        const foundIndex = SIDEBAR_SECTIONS.findIndex(ss => ss.link.replace(/^\//, '') === currentPathSegment);
        setSelectedSection(foundIndex !== -1 ? foundIndex : -1);
    }, [params]); // Depend on params to react to URL changes

    /**
     * Handles user logout.
     */
    const handleLogout = async () => {
        try {
            await AuthService.logout();
            window.location.href = "/login"; // Full page reload to clear state and redirect to login
            toast.success("Logout successful!");
        } catch (error: any) {
            console.error("Error logging out:", error);
            toast.error("Error logging out! Please try again.");
        }
    };

    return (
        <section
            // Base styles: fixed positioning, high z-index, white background, shadow
            className={`
                fixed z-30 bg-stone-50 border-gray-200 shadow-xl px-2
                ${isMobile
                    ? 'bottom-0 left-0 right-0 h-16 w-full flex flex-row items-center justify-around border-t'
                    // Desktop-specific styles: static vertical sidebar, dynamic width based on isOpen, vertical flex
                    : `top-0 left-0 h-screen ${isOpen ? "w-60 translate-x-0" : "w-16 -translate-x-full lg:translate-x-0"} flex-col justify-start border-r rounded-r-xl`
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
                        <img alt="CER Summer App" className="h-16 w-auto" src={isOpen ? cerLogo : cerLogoSmall} />
                    </button>
                </div>
            )}

            {/* Navigation List */}
            <ul className={`
                flex-1 w-full space-x-10 md:space-x-0
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
                            flex items-center cursor-pointer rounded-lg transition-colors duration-200 ease-in-out
                            ${isMobile
                                ? 'flex-col py-1 px-1 text-xs justify-center flex-1' // Mobile item: column, small text, even distribution
                                : 'flex-row py-3 px-4 text-lg justify-center sm:justify-start' // Desktop item: row, larger text
                            }
                            ${selectedSection === index
                                ? 'bg-blue-100 text-blue-800 border-blue-400' // Active state: light blue background, darker blue text/border
                                : 'text-gray-700 hover:text-blue-800 border border-transparent hover:border-blue-800 bg-white' // Inactive state: white background, gray text, subtle hover
                            }
                        `}
                    >
                        <i className={`${section.icon} text-xl ${isMobile ? 'mb-1' : ''}`} /> {/* Icon styling */}
                        {/* Section name - hidden on mobile, inline on desktop (with optional collapse) */}
                        <span className={`${isMobile ? 'hidden' : 'inline'} ${!isOpen ? 'hidden lg:inline' : 'ml-3 font-semibold'}`}>
                            {section.name}
                        </span>
                    </li>
                )}
                {/* Log Out Button (integrated into the navigation list for consistent layout) */}
                <li
                    onClick={handleLogout}
                    className={`
                        flex items-center cursor-pointer rounded-lg transition-colors duration-200 ease-in-out
                        ${isMobile
                            ? 'flex-col py-1 px-1 text-xs justify-center flex-1' // Mobile item
                            : 'flex-row py-3 px-4 text-lg justify-center sm:justify-start mt-auto' // Desktop item, mt-auto pushes it to bottom
                        }
                        text-gray-700 hover:text-blue-800 border border-transparent hover:border-blue-800 bg-white
                    `}
                    title="Log out"
                >
                    <i className="fa-solid fa-right-from-bracket text-xl" /> {/* Icon styling */}
                    <span className={`${isMobile ? 'hidden' : 'inline'} ${!isOpen ? 'hidden lg:inline' : 'ml-3 font-semibold'}`}>
                        Log Out
                    </span>
                </li>
            </ul>
        </section>
    );
};

export default Sidebar;
