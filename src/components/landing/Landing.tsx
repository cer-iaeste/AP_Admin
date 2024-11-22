import React, { useState, useEffect } from "react";
import { CountryType } from "../../types/types";

interface LandingProps {
    selectCountry: (countryName: string) => void
    countries: CountryType[]
}

const Landing: React.FC<LandingProps> = ({ selectCountry, countries }) => {
    const [displayedCountries, setDisplayedCountries] = useState<CountryType[]>([]);

    const handleSelectCountry = (event: any): void => {
        const countryName = event.currentTarget.dataset.name;
        selectCountry(countryName)
    }

    const onFilterCountriesHandler = (e: any): void => {
        const typedCountry = e.target.value;
        const filteredCountries = !typedCountry
            ? countries
            : countries.filter((country: CountryType) => country.name.toLowerCase().includes(typedCountry.toLowerCase()))
        setDisplayedCountries(filteredCountries)
    };

    useEffect(() => {
        setDisplayedCountries(countries)
    }, [countries])


    const cards = [
        {
            title: "Organized list of countries",
            desc: " Administrators can view, filter, and search the list of countries, making it easy to find and manage the desired country page",
            icon: "fa-clipboard-list"
        },
        {
            title: "Page management",
            desc: "Easily create, edit, or remove components that make up the structure and content of individual country pages",
            icon: "fa-file-signature"
        },
        {
            title: "Streamlined workflow",
            desc: "A user-friendly experience with options to quickly save and publish changes in real-time, ensuring smooth content updates across all country pages",
            icon: "fa-timeline"
        },
    ]

    return (
        <section className="bg-sky-100 h-full text-[#1B75BB] flex flex-col min-h-screen">
            {/* <div className="my-4 text-center font-bold flex flex-col space-y-4 items-center">
                <i className="fa fa-cogs text-5xl"></i>
                <h1 className="text-5xl">IAESTE AP Admin Panel</h1>
            </div> */}
            <div className="max-w-4xl mx-auto text-center my-4 space-y-2">
                <h3 className="font-semibold text-3xl pb-2">Welcome, Admin!</h3>
                <span className="text-lg md:text-2xl">Manage the platform’s content and ensure each country's page is up-to-date. Use this dashboard to add, edit or delete components for each country and customize the information displayed to users.</span>
            </div>
            <div className="font-bold items-center text-lg">
                    <i className="fa fa-circle-info mr-3"></i>Start by selecting a country
                </div>
            <div className="mt-6 space-y-4">
                <span className="font-semibold text-3xl">IAESTE CER & CoRe countries</span>
                <div>
                    <input
                        type="text"
                        className="p-2 max-w-md w-full border border-solid border-black rounded-xl"
                        placeholder="Search for a country"
                        onChange={onFilterCountriesHandler}
                    />
                </div>
                

                <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-4 max-w-5xl mx-auto">
                    {displayedCountries.map((country) =>
                        <li key={country.id} data-name={country.name} onClick={handleSelectCountry} className={`flex flex-col items-center p-3 shadow-xl rounded-md bg-gray-100 hover-bg-gradient cursor-pointer`}>
                            <img src={country.imageSrc} alt={country.imageAlt} className="rounded-full h-20 w-20 border hover:border-white" />
                            <span className="text-lg mt-2 font-semibold text-wrap">{country.name}</span>
                        </li>
                    )}
                </ul>
            </div>
            
        </section>
    )
}

export default Landing;