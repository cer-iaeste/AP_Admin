import React, { useState, useEffect } from "react";
import { CountryType } from "../../types/types";
import cerLogo from "../../images/cer-logo.png"
import { useNavigate } from "react-router-dom";

interface LandingProps {
    countries: CountryType[]
}

const Countries: React.FC<LandingProps> = ({ countries }) => {
    const [displayedCountries, setDisplayedCountries] = useState<CountryType[]>([]);
    const [regionCountries, setRegionCountries] = useState<CountryType[]>([])
    const [region, setRegion] = useState<Number>(0)
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    useEffect(() => {
        const filteredCountries = !searchQuery
            ? regionCountries
            : regionCountries.filter((country: CountryType) => country.name.toLowerCase().includes(searchQuery.toLowerCase()))
        setDisplayedCountries(filteredCountries)
    }, [searchQuery])

    const handleSelectCountry = (event: any): void => {
        const countryName = event.currentTarget.dataset.name
        navigate(`/countries/${countryName}`)
    }


    const onFilterCountriesHandler = (e: any) => setSearchQuery(e.target.value);

    const handleSelectRegion = (index: number) => setRegion(region === index ? 0 : index)

    const handleAddNewCountry = () => navigate('/countries/new')

    useEffect(() => {
        setDisplayedCountries(countries)
    }, [countries])

    useEffect(() => {
        !region ?
            setRegionCountries(countries)
            : setRegionCountries(
                countries.filter(country => region === 1 ?
                    country.region === "cer" || country.region === "core"
                    : country.region !== "cer" && country.region !== "core"
                )
            )
    }, [region])

    useEffect(() => {
        setDisplayedCountries(regionCountries)
    }, [regionCountries])

    return (
        <section className="bg-sky-100 h-full text-[#1B75BB] flex flex-col min-h-screen  max-w-6xl mx-auto mb-5">
            <div className="mt-6 space-y-4">
                <span className="font-semibold text-3xl lg:text-4xl">AP Countries</span>
                <div className="flex flex-row justify-between w-full  px-2">
                    <div className="flex flex-row gap-2 text-center my-2">
                        <button
                            className={`font-bold text-lg py-2 px-4 rounded-full transition duration-150 ease-in-out
                              ${region === 1
                                    ? 'bg-sky-300 text-sky-800'
                                    : 'bg-sky-200 text-sky-700 hover:bg-sky-300 hover:text-sky-800'
                                }
                              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex flex-row items-center`}
                            onClick={() => handleSelectRegion(1)}
                        >
                            <i className="fa-solid fa-earth-europe mr-0 sm:mr-2"></i>
                            <span className="hidden sm:block">CER & CoRe Members</span>
                        </button>
                        <button
                            className={`font-bold text-lg py-2 px-4 rounded-full transition duration-150 ease-in-out
                              ${region === 2
                                    ? 'bg-sky-300 text-sky-800'
                                    : 'bg-sky-200 text-sky-700 hover:bg-sky-300 hover:text-sky-800'
                                }
                              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex flex-row items-center`}
                            onClick={() => handleSelectRegion(2)}
                        >
                            <i className="fa-solid fa-globe mr-0 sm:mr-2"></i>
                            <span className="hidden sm:block">Global Members</span>
                        </button>
                    </div>
                    <div className="justify-end my-2 flex flex-row gap-4">
                        <div>
                            <input
                                value={searchQuery}
                                type="text"
                                className="p-2 max-w-md w-full border border-solid border-black rounded-xl"
                                placeholder="Search for a country"
                                onChange={onFilterCountriesHandler}
                            />
                        </div>
                        <button
                            className={`font-bold text-lg py-2 px-4 rounded-full transition duration-150 ease-in-out bg-sky-200 text-sky-700 hover:bg-sky-300 hover:text-sky-800
                              focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-opacity-50 flex flex-row items-center`}
                            onClick={handleAddNewCountry}
                        >
                            <i className="fa-solid fa-flag mr-0 sm:mr-2"></i>
                            <span className="hidden sm:block">Add a new country</span>
                        </button>
                    </div>
                </div>
                {/*
                <div className="block sm:hidden">
                    <input
                        type="text"
                        className="p-2 max-w-md w-full border border-solid border-black rounded-xl"
                        placeholder="Search for a country"
                        onChange={onFilterCountriesHandler}
                    />
                </div>
                */}
                {displayedCountries.length ? (
                    <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4">
                        {displayedCountries.map((country) =>
                            <li key={country.id} data-name={country.name} onClick={handleSelectCountry} className={`flex flex-col items-center p-3 shadow-xl rounded-md bg-gray-100 hover-bg-gradient cursor-pointer`}>
                                <img src={country.imageSrc} alt={country.imageAlt} className="rounded-full h-20 w-20 border hover:border-white" />
                                <span className="text-lg mt-2 font-semibold text-wrap">{country.name}</span>
                            </li>
                        )}
                    </ul>
                ) : (
                    <div className="flex w-full text-3xl font-semibold justify-center mt-16 mb-6">
                        <div
                            className="bg-sky-50 border border-sky-300 text-sky-700 px-8 py-6 rounded-xl shadow-md flex items-center space-x-3 text-2xl sm:text-3xl"
                            role="alert" aria-live="polite"
                        >
                            <i className="fa-solid fa-triangle-exclamation mr-2 text-3xl"></i>{" "}
                            <span>No countries found for search parameters!</span>
                        </div>
                    </div>
                )}

            </div>

        </section>
    )
}

export default Countries;