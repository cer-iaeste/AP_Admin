import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from "react-router-dom";
import { CardType, CountryType } from "../../types/types";
import "../../App.css" // Keep this if it contains global styles you need
import { getCountryData, handleSelectCard, mapCountryCards } from "../../global/Global";
import useWindowSize from "../../hooks/useScreenSize"; // Assuming this hook works correctly
import Logout from "./Logout"; // Assuming Logout component exists and accepts isMobile prop

const UserSidebar = () => {
    const [selectedCountry, setSelectedCountry] = useState<CountryType | undefined>(undefined);
    const [cards, setCards] = useState<CardType[]>([]);
    const location = useLocation();
    const navigate = useNavigate()
    const { width } = useWindowSize();
    const isMobile = width <= 1023; // Define mobile breakpoint
    const [selectedSection, setSelectedSection] = useState<number>(-1); // -1 for Admin Panel, otherwise index of card

    // Effect to get country data and set selected section based on URL
    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean); // e.g., ['countries', 'USA', 'Places']
        // Fetch country data if not already loaded or if country in URL changes
        const countryFromPath = pathSegments[1] || "";
        if (!selectedCountry || selectedCountry.name !== countryFromPath) {
            getCountryData(countryFromPath, setSelectedCountry);
        }

        // Determine which card/section is selected from the URL
        const cardTitleFromPath = pathSegments[2] || ""; // 'Places', 'Cuisine', etc.
        if (!cardTitleFromPath) {
            const foundIndex = cards.findIndex(c => c.title === cardTitleFromPath);
            if (foundIndex !== selectedSection) setSelectedSection(foundIndex)
        }
    }, [selectedCountry]); // Added selectedCountry and cards to dependencies for reactivity

    // Effect to map country data to cards once selectedCountry is available
    useEffect(() => {
        if (selectedCountry) {
            setCards(mapCountryCards(selectedCountry));
        }
    }, [selectedCountry]);

    // Effect to inform parent component about the selected card
    useEffect(() => {
        const link = handleSelectCard(selectedCountry?.name ?? "", selectedSection !== -1 ? cards[selectedSection]?.title : undefined);
        navigate(link)
        window.scrollTo({ top: 0, left: 0 })
    }, [selectedSection, cards, handleSelectCard]); // Add handleSelectCard to deps

    return (
        <section
            className={`
                fixed z-30 bg-white border-gray-200 shadow-xl
                ${isMobile
                    ? 'bottom-0 left-0 right-0 h-10 w-full flex flex-row items-center justify-start overflow-x-auto border-t' // Mobile: horizontal, scrollable
                    : 'top-0 left-0 h-screen w-64 flex-col justify-start border-r rounded-r-xl px-2 overflow-y-auto pt-4' // Desktop: vertical, scrollable
                }
            `}
            style={{ scrollbarWidth: "thin" }} // For Firefox
        >
            <ul className={`
                flex-1 w-full
                ${isMobile
                    ? 'flex flex-row justify-start items-center min-w-max' // Mobile: horizontal, fixed space, allow min-width for scroll
                    : 'flex flex-col space-y-4 px-2' // Desktop: vertical, spaced
                }
            `}>
                {/* Admin Panel Link */}
                <li
                    key="admin"
                    onClick={() => setSelectedSection(-1)}
                    className={`
                        flex items-center cursor-pointer transition-all duration-200 ease-in-out
                        rounded-lg shadow-sm border border-gray-200
                        ${isMobile
                            ? 'flex-shrink-0 w-24 h-10 flex-col py-1 text-xs justify-center' // Mobile: fixed size, shrink-0
                            : 'flex-row py-3 px-4 text-lg justify-start' // Desktop
                        }
                        ${selectedSection === -1
                            ? 'text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700' // Active state
                            : 'bg-blue-600 text-white border-blue-700 border-t shadow-md ' // Inactive hover state
                        }
                    `}
                >
                    <img
                        src={selectedCountry?.imageSrc || "https://placehold.co/40x40/cccccc/ffffff?text=NA"} // Fallback image if selectedCountry not loaded
                        alt={selectedCountry?.imageAlt || "Admin Panel"}
                        className={`rounded-full ${isMobile ? "h-8 w-8" : "h-10 w-10"} border border-gray-300 flex-shrink-0`}
                    />
                    <span className={`${isMobile ? 'hidden' : 'ml-3 font-semibold'} text-sm sm:text-base`}>
                        Admin Panel
                    </span>
                </li>

                {/* Dynamically Rendered Card Links */}
                {cards.map((card, index) =>
                    <li
                        key={index}
                        onClick={() => setSelectedSection(index)}
                        className={`
                            flex items-center cursor-pointer transition-all duration-200 ease-in-out
                           rounded-lg shadow-sm border border-gray-200
                            ${isMobile
                                ? 'flex-shrink-0 w-24 h-10 flex-col py-1 text-xs justify-center' // Mobile: fixed size, shrink-0
                                : 'flex-row py-3 px-4 text-lg justify-start' // Desktop
                            }
                            ${selectedSection !== index
                                ? 'bg-blue-600 text-white border-t border-blue-700 shadow-md' // Active state
                                : 'text-gray-700 hover:bg-blue-50 hover:border-blue-300 hover:text-blue-700' // Inactive hover state
                            }
                        `}
                    >
                        <i className={`${card.icon} text-xl ${isMobile ? 'mb-1' : ''} ${selectedSection === index ? 'text-white' : 'text-gray-600'}`} />
                        <span className={`${isMobile ? 'hidden' : 'ml-3 font-semibold'} text-sm sm:text-base`}>
                            {card.sidebarTitle ?? card.title}
                        </span>
                    </li>
                )}

                {/* Logout Button (if applicable, ensure its own styling matches) */}
                <Logout isMobile={isMobile} /> {/* Pass isMobile prop to Logout */}
            </ul>
        </section>
    );
};

export default UserSidebar;
