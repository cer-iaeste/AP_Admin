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
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
        if (cardTitleFromPath) {
            const foundIndex = cards.findIndex(c => c.title === cardTitleFromPath.replaceAll("%20", " "));
            if (foundIndex !== selectedSection) setSelectedSection(foundIndex)
        }
    }, [selectedCountry]); // Added selectedCountry and cards to dependencies for reactivity

    // Effect to map country data to cards once selectedCountry is available
    useEffect(() => {
        if (selectedCountry) setCards(mapCountryCards(selectedCountry));
    }, [selectedCountry])

    // Effect to inform parent component about the selected card
    useEffect(() => {
        console.log(selectedSection)
        const link = handleSelectCard(selectedCountry?.name ?? "", selectedSection !== -1 ? cards[selectedSection]?.title : undefined);
        console.log(link)
        navigate(link)
        window.scrollTo({ top: 0, left: 0 })
    }, [selectedSection, cards, handleSelectCard]); // Add handleSelectCard to deps

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean)
        console.log(pathSegments)
        // no card chosen
        if (pathSegments.length < 3 && selectedSection !== -1) setSelectedSection(-1)
        // card chosen
        else {
            const cardTitleFromPath = pathSegments[2] || ""
            console.log(cardTitleFromPath.replaceAll("%20", " "))
            if (cardTitleFromPath) {
                console.log(cards)
                const foundIndex = cards.findIndex(c => c.title === cardTitleFromPath.replaceAll("%20", " "))
                if (foundIndex !== selectedSection) setSelectedSection(foundIndex)
            }
        }
        setIsMobileMenuOpen(false)
    }, [location])

    const toggleMobileMenu = () => setIsMobileMenuOpen(prev => !prev)

    return (
        <section>
            {!isMobile ? (
                <section style={{ scrollbarWidth: "thin" }} className="fixed z-30 bg-white border-gray-200 shadow-xl top-0 left-0 h-screen w-64 flex-col justify-start border-r rounded-r-xl px-2 overflow-y-auto py-4">
                    <ul className="flex-1 w-full flex flex-col space-y-4 px-2">
                        <li key="admin-desktop" onClick={() => setSelectedSection(-1)}
                            className={`flex items-center cursor-pointer transition-all duration-200 ease-in-out shadow-sm text-white
                                flex-row py-3 px-4 text-lg justify-start bg-gradient mix-blend-multiply rounded-lg
                                ${selectedSection === -1 ? 'hover:scale-105' : ''}
                        
                            `}
                        >
                            <img
                                src={selectedCountry?.imageSrc || "https://placehold.co/40x40/cccccc/ffffff?text=NA"} // Fallback image if selectedCountry not loaded
                                alt={selectedCountry?.imageAlt || "Admin Panel"}
                                className={`rounded-full ${isMobile ? "h-8 w-8" : "h-10 w-10"} border border-gray-300 flex-shrink-0`}
                            />
                            <span className="ml-3 font-semibold text-sm sm:text-base">
                                Admin Panel
                            </span>
                        </li>

                        {/* Dynamically Rendered Card Links */}
                        {cards.map((card, index) =>
                            <li
                                key={index}
                                onClick={() => setSelectedSection(index)}
                                className={`sidebarBtn ${selectedSection !== index ? "sidebarBtnNotSelected" : "sidebarBtnSelected"}`}
                            >
                                <i className={`${card.icon} text-xl text-blue-600`} />
                                <span className="ml-3 font-semibold text-sm sm:text-base text-blue-800">
                                    {card.sidebarTitle ?? card.title}
                                </span>
                            </li>
                        )}

                        {/* Logout Button (if applicable, ensure its own styling matches) */}
                        <Logout isMobile={isMobile} /> {/* Pass isMobile prop to Logout */}
                    </ul>
                </section>
            ) : (
                <section
                    className="
                        fixed bottom-0 left-0 right-0 h-10 bg-white border-t border-gray-200 shadow-xl z-30
                        grid grid-cols-3 items-center
                    "
                >
                    {/* Admin Panel Button */}
                    <button
                        onClick={() => setSelectedSection(-1)}
                        className={`
                            flex flex-col items-center justify-center
                            transition-all duration-200 ease-in-out bg-gradient mix-blend-multiply h-10
                            ${selectedSection === -1
                                ? 'text-blue-600' // Active icon color
                                : 'text-gray-600 hover:text-blue-800' // Inactive icon color
                            }
                        `}
                    >
                        <img
                            src={selectedCountry?.imageSrc || "https://placehold.co/24x24/cccccc/ffffff?text=NA"} // Smaller fallback
                            alt={selectedCountry?.imageAlt || "Admin"}
                            className="rounded-full h-6 w-6 border border-gray-300"
                        />
                    </button>

                    {/* Burger Menu Button */}
                    <button
                        onClick={toggleMobileMenu}
                        className="
                            flex flex-col items-center justify-center h-10
                            bg-gradient-to-r from-[#49C0B5] to-blue-600 to text-white hover:text-[#d54c55] transition-all duration-200 ease-in-out
                        "
                    >
                        <i className="fa-solid fa-bars text-xl"></i>
                    </button>

                    {/* Logout Button for Mobile */}
                    <Logout isMobile={isMobile} />

                    {/* Overlay menu*/}
                    <div
                        className={`
                            fixed inset-0 bg-white z-40 flex flex-col
                            transition-transform duration-300 ease-in-out transform
                            ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'}
                        `}
                    >
                        {/* Overlay Header with Close Button */}
                        <div className="flex justify-between items-center border-b px-4 py-1 text-white border-gray-200 bg-gradient-to-r from-blue-700 to-indigo-800">
                            <h2 className="text-2xl font-bold">Menu</h2>
                            <button
                                onClick={toggleMobileMenu}
                                className="p-2 rounded-full hover:text-[#d54c55] transition-colors"
                                title="Close menu"
                            >
                                <i className="fa-solid fa-xmark text-2xl"></i>
                            </button>
                        </div>

                        {/* Overlay Menu Items (scrollable) */}
                        <ul className="grid sm:grid-cols-2 overflow-y-auto gap-3 p-4" style={{ scrollbarWidth: "thin" }}>
                            {cards.map((card, index) => (
                                <li
                                    key={index}
                                    onClick={() => setSelectedSection(index)} // Uses same click handler
                                    className={`sidebarBtn ${selectedSection !== index ? "sidebarBtnNotSelected" : "sidebarBtnSelected"}`}
                                >
                                    <i className={`${card.icon} text-xl text-blue-600 mr-4`} />
                                    <span className="font-semibold text-lg">
                                        {card.sidebarTitle ?? card.title}
                                    </span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </section>
            )}
        </section>

    );
};

export default UserSidebar;
