import React, { useState, useEffect } from "react"
import { CountryType } from "../../types/types"
import { useNavigate } from "react-router-dom"

interface LandingProps {
    countries: CountryType[]
}

const Countries: React.FC<LandingProps> = ({ countries }) => {
    const [displayedCountries, setDisplayedCountries] = useState<CountryType[]>([]);
    const [regionFilter, setRegionFilter] = useState<number>(0); // 0: All, 1: CER & CoRe, 2: Global
    const [searchQuery, setSearchQuery] = useState('');
    const [showFilterOptions, setShowFilterOptions] = useState(false)
    const navigate = useNavigate()

    const handleSelectCountry = (event: React.MouseEvent<HTMLLIElement>): void => {
        const countryName = event.currentTarget.dataset.name;
        if (countryName) {
            navigate(`/countries/${countryName}`);
            window.scrollTo({ top: 0, left: 0 })
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleSelectRegion = (index: number) => {
        setRegionFilter(regionFilter === index ? 0 : index); // Toggle effect
        setSearchQuery(''); // Clear search when region filter changes
    };

    const handleAddNewCountry = () => navigate('/countries/new');

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


    useEffect(() => {
        let initialDisplay = countries;
        if (regionFilter === 1) {
            initialDisplay = initialDisplay.filter(country => country.region === "cer" || country.region === "core");
        } else if (regionFilter === 2) {
            initialDisplay = initialDisplay.filter(country => country.region !== "cer" && country.region !== "core");
        }
        setDisplayedCountries(initialDisplay);
    }, [countries, regionFilter]); // Re-run when countries data or regionFilter changes

    return (
        <section className="bg-sky-100 min-h-screen text-[#1B75BB] py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Main Header Section (always visible) */}
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Title */}
                        <div className="flex flex-row items-center gap-4 font-semibold text-2xl md:text-3xl lg:text-4xl text-[#1B75BB]">
                            <i className="fa-solid fa-earth-europe"></i>
                            <span className=" flex-shrink-0">
                                AP Countries
                            </span>
                        </div>

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
                                    className="base-btn bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800"
                                    onClick={() => setShowFilterOptions(!showFilterOptions)}
                                >
                                    <i className={`fa-solid ${showFilterOptions ? 'fa-filter-circle-xmark' : 'fa-filter'} mr-1 md:mr-2`}></i>
                                    <span>{showFilterOptions ? 'Hide Filters' : 'Filters'}</span>
                                </button>

                                {/* Add New Country Button */}
                                <button
                                    className="base-btn bg-[#1B75BB] text-white hover:bg-[#155A90]"
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
                            className={`base-btn ${regionFilter === 1 ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
                            onClick={() => handleSelectRegion(1)}
                        >
                            <i className="fa-solid fa-earth-europe mr-1 md:mr-2"></i>
                            <span>CER & CoRe</span>
                        </button>
                        {/* Global Members Button */}
                        <button
                            className={`base-btn ${regionFilter === 2 ? 'bg-blue-500 text-white shadow-md' : 'bg-white text-blue-700 hover:bg-blue-100 hover:text-blue-800'}`}
                            onClick={() => handleSelectRegion(2)}
                        >
                            <i className="fa-solid fa-globe mr-1 md:mr-2"></i>
                            <span>Global</span>
                        </button>
                        {/* Show All Button */}
                        {regionFilter !== 0 && (
                            <button
                                className="base-btn bg-gray-100 text-gray-600 hover:bg-gray-200"
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
                                    bg-blue-50 hover:bg-[#a3ffe0] hover:border-blue-300 cursor-pointer
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
