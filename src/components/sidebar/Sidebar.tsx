import React, { useEffect, useState } from "react";
import cerLogo from "../../images/cer-logo.png";
import { CountryType } from "../../types/types";
import "../../App.css"

interface SidebarProps {
    isOpen: boolean
    selectCountry: (countryName: string) => void
    country: string
    countries: CountryType[]
    navigateHome: () => void
    toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, selectCountry, country, countries, navigateHome, toggleSidebar }) => {

    const [selectedCountry, setSelectedCountry] = useState("");
    const [displayedCountries, setDisplayedCountries] = useState<CountryType[]>([]);

    const handleSelectCountry = (event: any): void => {
        const countryName = event.currentTarget.dataset.name;
        setSelectedCountry(countryName);
        selectCountry(countryName)
    }

    const onFilterCountriesHandler = (e: any): void => {
        const typedCountry = e.target.value;
        const filteredCountries = !typedCountry
            ? countries
            : countries.filter((country: CountryType) => country.name.toLowerCase().includes(typedCountry.toLowerCase()))
        setDisplayedCountries(filteredCountries)
    };

    const resetSidebar = (): void => {
        setSelectedCountry("")
        navigateHome()
    }

    useEffect(() => {
        setDisplayedCountries(countries)
    }, [countries])

    useEffect(() => {
        setSelectedCountry(country)
    }, [country])

    return (
        <section className={`fixed z-20 top-0 left-0 bg-[#F1F1E6] border-r border-[#1B75BB] w-64 max-h-screen min-h-full overflow-y-scroll transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ scrollbarWidth: "thin" }}
        >
            <ul>
                <li key="admin" className="border-b-2 px-2 text-2xl font-semibold  cursor-pointer flex justify-between">
                    <button onClick={resetSidebar} className="items-center hover:scale-105">
                        <img alt="CER Summer App" className="h-16 w-auto" src={cerLogo} />
                    </button>
                    <button
                        className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 block lg:hidden"
                        onClick={toggleSidebar}
                        >
                        <i className="fa-regular fa-circle-xmark text-3xl "></i>
                    </button>
                </li>
                <li key="search">
                    <input
                        type="text"
                        className="p-2 max-w-md w-full border border-solid border-black rounded-xl"
                        placeholder="Search for a country"
                        onChange={onFilterCountriesHandler}
                    />
                </li>
                {displayedCountries.length ? displayedCountries.map((country: CountryType) =>
                    <li key={country.id} data-name={country.name} onClick={handleSelectCountry} className={`flex flex-row items-center p-3 border-b border-gray-300 hover-bg-gradient cursor-pointer ${selectedCountry === country.name ? `bg-gradient text-white` : ""}`}>
                        <img src={country.imageSrc} alt={country.imageAlt} className="rounded-full h-10 w-10 border hover:border-white" />
                        <span className="text-lg ml-3 font-semibold text-wrap">{country.name}</span>
                    </li>
                ) : (
                    <li className="flex justify-center items-center mt-2 font-semibold text-lg">
                        <i className="fa fa-triangle-exclamation mr-2"></i>No countires found
                    </li>
                )}
            </ul>
        </section>
    )
}

export default Sidebar;