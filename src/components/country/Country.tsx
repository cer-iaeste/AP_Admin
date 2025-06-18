import React, { useState, useEffect } from "react";
import { loadingTimer, mapCountryCards, getCountryData } from "../../global/Global"; // Assuming these functions exist
import Plane from "../plane/Plane"; // Assuming Plane component exists for loading state
import { CardType, CountryType } from "../../types/types"; // Ensure CardType and CountryType are defined
import { useParams, useNavigate } from "react-router-dom";
import Back from "../../global/Back"; // Assuming Back component exists

const Country: React.FC = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<CountryType | undefined>(undefined);
    const [cards, setCards] = useState<CardType[]>([]);
    const { country } = useParams(); // Get country name from URL params
    const navigate = useNavigate();

    // Effect to fetch country data when the 'country' param changes
    useEffect(() => {
        // Ensure 'country' param exists before fetching data
        if (country) {
            setIsLoading(true); // Set loading true before fetching new data
            getCountryData(country, setSelectedCountry, setIsLoading);
        }
    }, [country]); // Dependency array: re-run when URL 'country' param changes

    // Effect to map country data to cards and manage loading state
    useEffect(() => {
        if (selectedCountry) {
            setCards(mapCountryCards(selectedCountry));
            loadingTimer(setIsLoading); // Assuming loadingTimer handles setting isLoading to false after a delay
        } else if (country && !isLoading) {
            // If country is in URL but selectedCountry is null/undefined after loading,
            // it means country was not found. We can keep isLoading false and show 'not found' UI.
            // No action needed here, handled by the render logic.
        }
    }, [selectedCountry, country, isLoading]); // Add isLoading to deps for clarity, though it might not strictly be needed if loadingTimer sets it.

    // Handler for clicking a card, navigates to its detailed page
    const handleSelectCard = (cardTitle: string) => {
        // Ensure country name is available before navigating
        if (selectedCountry?.name) {
            navigate(`/countries/${selectedCountry.name}/${cardTitle}`);
            window.scrollTo({top: 0, left: 0})
        }
    };

    return (
        <section className="bg-sky-100 min-h-screen text-[#1B75BB]">
            {isLoading ? (
                <Plane country={selectedCountry?.name ?? ""} />
            ) : (
                // Conditional rendering based on whether a country was found
                !!selectedCountry ? (
                    <div className="max-w-7xl mx-auto space-y-8 p-4">
                        {/* Country Header Section (Flag and Name) - REVERTED TO PREVIOUS SUBTLE DESIGN */}
                        <div className="
                            relative overflow-hidden
                            bg-gradient mix-blend-multiply // More subtle gradient
                            p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200 // Softer shadow and border
                            flex flex-col items-center justify-center text-center
                        ">
                            {/* Back Button - Using the external Back component */}
                            <div className="absolute top-2 left-2 z-20">
                                <Back banner={true}/>
                            </div>

                            {/* Abstract Pattern Overlay (example: a subtle grid or wave) */}
                            <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url(https://www.transparenttextures.com/patterns/cubes.png)' }}></div>

                            <div className="flex flex-col sm:flex-row items-center justify-center w-full z-10">
                                <img
                                    src={selectedCountry.imageSrc}
                                    alt={selectedCountry.imageAlt}
                                    className="rounded-full h-24 w-24 sm:h-32 sm:w-32 object-cover border-2 border-gray-300 shadow-md flex-shrink-0" // Reverted flag size and border
                                />
                                <div className="flex flex-col ml-0 sm:ml-6 mt-4 sm:mt-0 font-bold text-white text-center sm:text-left">
                                    <span className="text-xl sm:text-3xl">IAESTE</span> {/* Reverted text size */}
                                    <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl break-words leading-tight">{selectedCountry.name}</span> {/* Reverted text size and color */}
                                    {/* Region information as a prominent tag */}
                                    {selectedCountry.region && (
                                        <span className="bg-white text-blue-500 px-4 py-1 rounded-full text-base sm:text-lg font-bold mt-2 shadow-md inline-block self-center sm:self-start">
                                            {selectedCountry.region.toUpperCase()} Member
                                        </span>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Country Cards List - UPDATED DESIGN */}
                        <ul className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                            {cards.map((card, index) =>
                                <li
                                    key={index}
                                    className={`
                                        relative bg-blue-50 shadow-md space-y-2 rounded-xl p-4 // Card background, softer shadow
                                        text-center text-[#1B75BB] cursor-pointer
                                        border border-blue-200 // Subtle blue border
                                        transition-all duration-200 transform hover:scale-105 hover:bg-blue-100 hover:border-blue-400 hover:shadow-xl // Enhanced hover effects
                                        min-h-[160px] sm:min-h-[180px]
                                        flex flex-col justify-center items-center
                                    `}
                                >
                                    <button onClick={() => handleSelectCard(card.title)} className="grid grid-rows-2 h-full w-full items-center">
                                        {/* Conditional ribbon when card.isEmpty is true */}
                                        {card.isSectionEmpty &&
                                            <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-3 py-1 rounded-br-xl rounded-tl-xl z-10 shadow-md">
                                                Section empty
                                            </div>
                                        }
                                        {/* Top half with the icon */}
                                        <div className="flex items-center justify-center flex-1">
                                            <i className={`${card.icon} text-4xl sm:text-5xl text-blue-600`} aria-hidden="true" /> {/* Vibrant blue icon */}
                                        </div>

                                        {/* Bottom half with the title */}
                                        <div className="flex items-center justify-center flex-1">
                                            <h3 className="text-xl sm:text-2xl font-bold text-blue-800 break-words"> {/* Darker blue title */}
                                                {card.title}
                                            </h3>
                                        </div>
                                    </button>
                                </li>
                            )}
                        </ul>
                    </div>
                ) : (
                    // Display "Country not found" message
                    <div className="flex items-center justify-center min-h-[calc(100vh-64px)]">
                        <div
                            className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-md flex flex-col sm:flex-row items-center space-y-3 sm:space-y-0 sm:space-x-3 text-lg sm:text-xl text-center"
                            role="alert" aria-live="polite"
                        >
                            <i className="fa-solid fa-triangle-exclamation mr-2 text-3xl sm:text-4xl"></i>{" "}
                            <div className="flex flex-col items-center sm:items-start">
                                <h1 className="text-2xl sm:text-3xl font-bold">Country not found</h1>
                                <span className="pt-2 font-bold text-base sm:text-lg text-gray-700">
                                    <i className="fa fa-circle-info mr-2"></i>Start by selecting a section from the sidebar
                                </span>
                            </div>
                        </div>
                    </div>
                )
            )}
        </section>
    );
};

export default Country;
