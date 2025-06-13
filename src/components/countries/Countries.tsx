import React, { useState, useEffect } from "react";
import { CountryType } from "../../types/types"; // Ensure CountryType is correctly defined with 'region'
import cerLogo from "../../images/cer-logo.png" // Assuming this is still used somewhere, otherwise can be removed if only for landing
import { useNavigate } from "react-router-dom";

interface LandingProps {
    countries: CountryType[] // Assumes CountryType has a 'region' property (e.g., 'cer', 'core', 'other')
}

const Countries: React.FC<LandingProps> = ({ countries }) => {
    const [displayedCountries, setDisplayedCountries] = useState<CountryType[]>([]);
    const [regionFilter, setRegionFilter] = useState<number>(0); // 0: All, 1: CER & CoRe, 2: Global
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false); // State to toggle filter options visibility
    const navigate = useNavigate();

    /**
     * Handles navigation to a specific country's page when a country card is clicked.
     * @param event The React mouse event from the clicked list item.
     */
    const handleSelectCountry = (event: React.MouseEvent<HTMLLIElement>): void => {
        const countryName = event.currentTarget.dataset.name;
        if (countryName) {
            navigate(`/countries/${countryName}`);
        }
    };

    /**
     * Handles changes in the search input field, updating the search query state.
     * @param e The change event from the input element.
     */
    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    /**
     * Handles selection of a region filter. Toggles the filter if the same region is clicked.
     * @param index The index representing the selected region (0: All, 1: CER & CoRe, 2: Global).
     */
    const handleSelectRegion = (index: number) => {
        setRegionFilter(regionFilter === index ? 0 : index); // Toggle effect
        setSearchQuery(''); // Clear search when region filter changes
    };

    /**
     * Navigates to the 'add new country' page.
     */
    const handleAddNewCountry = () => navigate('/countries/new');

    /**
     * Effect to apply filters (region and search) to the countries list.
     * Runs whenever 'countries', 'regionFilter', or 'searchQuery' changes.
     */
    useEffect(() => {
        let filtered = countries;

        // Apply region filter
        if (regionFilter === 1) {
            filtered = filtered.filter(country => country.region === "cer" || country.region === "core");
        } else if (regionFilter === 2) {
            filtered = filtered.filter(country => country.region !== "cer" && country.region !== "core");
        }

        // Apply search query filter
        if (searchQuery) {
            filtered = filtered.filter(country =>
                country.name.toLowerCase().includes(searchQuery.toLowerCase())
            );
        }

        setDisplayedCountries(filtered);
    }, [countries, regionFilter, searchQuery]);

    // Initial load/reset of displayed countries based on region filter
    // This effect ensures that the list is updated when the region filter changes
    useEffect(() => {
        // This effect can be simplified since the main filtering logic is in the previous useEffect.
        // It ensures the list reflects the initial region filter and no search.
        let initialDisplay = countries;
        if (regionFilter === 1) {
            initialDisplay = initialDisplay.filter(country => country.region === "cer" || country.region === "core");
        } else if (regionFilter === 2) {
            initialDisplay = initialDisplay.filter(country => country.region !== "cer" && country.region !== "core");
        }
        setDisplayedCountries(initialDisplay);
    }, [countries, regionFilter]); // Re-run when countries data or regionFilter changes

    // Base button classes for consistent styling
    const baseButtonClasses = `
        font-semibold text-base py-2 px-3 rounded-full transition duration-150 ease-in-out // Smaller on mobile
        focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50
        flex items-center justify-center whitespace-nowrap
        md:text-lg md:py-2 md:px-4 // Larger on medium and up
        border border-blue-200
    `;

    return (
        <section className="bg-sky-100 min-h-screen text-[#1B75BB] py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Main Header Section (always visible) */}
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Title */}
                        <span className="font-semibold text-2xl md:text-3xl lg:text-4xl text-gray-800 flex-shrink-0">
                            AP Countries
                        </span>

                        {/* Right section: Search, Filter Toggle, Add New Country */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {/* Search Input */}
                            <input
                                value={searchQuery}
                                type="text"
                                className="p-2 w-full sm:max-w-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-sm text-base"
                                placeholder="Search for a country..."
                                onChange={handleSearchChange}
                            />
                            <div className="flex flex-row items-center gap-3">
                                {/* Filter Toggle Button */}
                                <button
                                    className={`${baseButtonClasses} bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800`}
                                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                                >
                                    <i className={`fa-solid ${showFilterOptions ? 'fa-filter-circle-xmark' : 'fa-filter'} mr-1 md:mr-2`}></i>
                                    <span>{showFilterOptions ? 'Hide Filters' : 'Filters'}</span>
                                </button>

                                {/* Add New Country Button */}
                                <button
                                    className={`${baseButtonClasses} bg-[#1B75BB] text-white hover:bg-[#155A90]`}
                                    onClick={handleAddNewCountry}
                                >
                                    <i className="fa-solid fa-plus mr-1 md:mr-2"></i>
                                    <span>New country</span>
                                </button>
                            </div>

                        </div>
                    </div>
                </div>

                {/* Conditional Filter Options Section - Smoother Appearance */}
                <div className={`
                    bg-white p-4 rounded-xl shadow-lg border border-gray-200
                    overflow-hidden transition-all duration-300 ease-in-out
                    ${showFilterOptions ? 'max-h-96 opacity-100 mt-4' : 'hidden max-h-0 opacity-0 mt-0 -mb-4'} // Added margin for spacing
                `}>
                    <div className="flex flex-wrap justify-center gap-2 items-center">
                        {/* CER & CoRe Members Button */}
                        <span className="text-xl font-semibold">Region: </span>
                        <button
                            className={`${baseButtonClasses} ${regionFilter === 1 ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
                            onClick={() => handleSelectRegion(1)}
                        >
                            <i className="fa-solid fa-earth-europe mr-1 md:mr-2"></i>
                            <span>CER & CoRe</span>
                        </button>
                        {/* Global Members Button */}
                        <button
                            className={`${baseButtonClasses} ${regionFilter === 2 ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
                            onClick={() => handleSelectRegion(2)}
                        >
                            <i className="fa-solid fa-globe mr-1 md:mr-2"></i>
                            <span>Global</span>
                        </button>
                        {/* Show All Button */}
                        {regionFilter !== 0 && (
                            <button
                                className={`${baseButtonClasses} bg-gray-100 text-gray-600 hover:bg-gray-200`}
                                onClick={() => handleSelectRegion(0)}
                            >
                                <i className="fa-solid fa-xmark mr-1 md:mr-2"></i>
                                <span>Show All</span>
                            </button>
                        )}
                    </div>
                </div>

                {/* Countries List */}
                {displayedCountries.length > 0 ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                        {displayedCountries.map((country) =>
                            <li
                                key={country.id}
                                data-name={country.name}
                                onClick={handleSelectCountry}
                                className={`
                                    flex flex-col items-center p-4 rounded-xl shadow-lg border border-gray-200
                                    bg-blue-50 hover:bg-blue-100 hover:border-blue-300 cursor-pointer
                                    transition-all duration-200 transform hover:scale-105
                                `}
                            >
                                <img src={country.imageSrc} alt={country.imageAlt} className="rounded-full h-20 w-20 object-cover border-2 border-gray-200 shadow-sm" />
                                <span className="text-lg mt-3 font-semibold text-gray-800 text-center">{country.name}</span>
                                <span className="text-sm text-gray-500 mt-1">{country.region.toUpperCase()}</span>
                            </li>
                        )}
                    </ul>
                ) : (
                    <div className="flex w-full justify-center mt-16 mb-6">
                        <div
                            className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-md flex items-center space-x-3 text-lg sm:text-xl"
                            role="alert" aria-live="polite"
                        >
                            <i className="fa-solid fa-triangle-exclamation mr-2 text-2xl"></i>{" "}
                            <span>No countries found for your current filters!</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    );
}

export default Countries;
