import { useState, useEffect } from "react";
import { loadingTimer, mapCountryCards, getCountryData } from "../../global/Global";
import Plane from "../plane/Plane";
import { CardType, CountryType } from "../../types/types";
import { useParams, useNavigate } from "react-router-dom";

const Country = () => {
    const [isLoading, setIsLoading] = useState(true);
    const [selectedCountry, setSelectedCountry] = useState<CountryType>()
    const [cards, setCards] = useState<CardType[]>([])
    const { country } = useParams()
    const navigate = useNavigate();

    useEffect(() => {
        getCountryData(country, setSelectedCountry, setIsLoading)
    }, [country]);

    useEffect(() => {
        setCards(mapCountryCards(selectedCountry))
        loadingTimer(setIsLoading)
    }, [selectedCountry])

    const handleSelectCard = (card: string) => {
        navigate(`/${selectedCountry?.name}/${card}`)
    }

    return (
        <section className="relative w-full">
            {isLoading ? (
                <Plane country={selectedCountry?.name ?? ""}></Plane>
            ) : (
                !!selectedCountry ? (
                    <section className="p-2 bg-sky-100 h-full">
                        <div className="max-w-7xl mx-auto">
                            <div className="flex flex-col my-4">
                                <div className="flex items-center justify-center w-full ">
                                    <img src={selectedCountry.imageSrc} alt={selectedCountry.imageAlt} className="rounded-full h-20 w-20 sm:h-32 sm:w-32 border" />
                                    <div className="flex flex-col ml-5 font-bold text-[#1B75BB] text-left">
                                        <span className="text=xl sm:text-3xl">IAESTE</span>
                                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{selectedCountry.name}</span>
                                    </div>
                                </div>
                            </div>
                            <ul className="mt-8 grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                                {/* <li className={`bg-[#1B75BB] shadow-xl space-y-2 rounded-lg p-2 py-6 sm:p-6 text-center text-white cursor-pointer hover:${bgGradient}`}>
                                    <a href={country.href} target="_blank" rel="noreferrer">
                                        <div className="flex flex items-center justify-center h-1/2">
                                            <i className="fa fa-eye text-4xl aria-hidden='true'" />
                                        </div>
                                        <div className="flex grow items-center justify-center h-1/2">
                                            <h3 className="text-xl sm:text-2xl font-bold">
                                                Preview page
                                            </h3>
                                        </div>
                                    </a>
                                </li> */}

                                {cards.map((card, index) =>
                                    <li key={index}
                                        className={`relative bg-gray-100 shadow-xl space-y-2 rounded-lg p-2 py-6 sm:p-6 text-center text-[#1B75BB] cursor-pointer hover-bg-gradient 105 h-32 sm:h-44`}>
                                        <button onClick={() => handleSelectCard(card.title)} className="grid grid-rows-2 h-full w-full items-center">
                                            {/* Conditional ribbon when card.isEmpty is true */}
                                            {card.isSectionEmpty &&
                                                <div className="absolute top-0 left-0 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-br-lg z-10">
                                                    Section empty
                                                </div>
                                            }
                                            {/* Top half with the icon */}
                                            <div className="flex flex items-center justify-center h-1/2">
                                                <i className={`${card.icon} text-4xl aria-hidden="true`} />
                                            </div>

                                            {/* Bottom half with the title */}
                                            <div className="flex items-center justify-center h-1/2">
                                                <h3 className="text-xl sm:text-2xl font-bold">
                                                    {card.title}
                                                </h3>
                                            </div>

                                        </button>
                                    </li>
                                )}
                            </ul>
                        </div>
                    </section>
                ) : (
                    <section className="px-4 py-2 bg-sky-100 h-screen text-[#1B75BB]">
                        <div className="my-4 text-center font-bold flex flex-col space-y-4 items-center">
                            <i className="fa fa-triangle-exclamation text-5xl"></i>
                            <h1 className="text-5xl">Country not found</h1>
                            <div className="pt-2 font-bold items-center text-lg">
                                <i className="fa fa-circle-info mr-3"></i>Start by selecting a country from the sidebar to access the country menu
                            </div>
                        </div>
                    </section>
                )
            )}
        </section>
    )
}

export default Country;