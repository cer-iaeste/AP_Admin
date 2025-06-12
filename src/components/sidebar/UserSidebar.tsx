import React, { useEffect, useState } from "react";
import { CardType, CountryType } from "../../types/types";
import "../../App.css"
import { getCountryData, mapCountryCards } from "../../global/Global";
import { useLocation, useNavigate } from "react-router-dom";

interface SidebarProps {
    isOpen: boolean
    toggleSidebar: () => void
}

const UserSidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [selectedCountry, setSelectedCountry] = useState<CountryType>()
    const [cards, setCards] = useState<CardType[]>([])
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        const countryFromPath = pathSegments[0] || "";
        getCountryData(countryFromPath, setSelectedCountry)
    }, [location]);

    useEffect(() => {
        setCards(mapCountryCards(selectedCountry))
    }, [selectedCountry])

    const handleSelectCard = (card: string) => {
        navigate(`/${selectedCountry?.name}/${card}`)
        toggleSidebar()
    }

    const resetSidebar = (): void => {
        navigate(`/${selectedCountry?.name}`)
        toggleSidebar()
    }

    return (
        <section className={`fixed z-20 top-0 left-0 bg-[#F1F1E6] border-r border-[#1B75BB] w-48 max-h-screen min-h-full overflow-y-scroll transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ scrollbarWidth: "thin" }}
        >
            <ul>
                <li key="admin" className="border-b-2 px-2 text-2xl font-semibold flex justify-between">
                    <button onClick={resetSidebar} className="flex items-center justify-center hover:scale-105">
                        <img src={selectedCountry?.imageSrc} alt={selectedCountry?.imageAlt} className="rounded-full h-10 w-10 border" />
                        <div className="flex flex-col font-bold text-[#1B75BB] text-left ml-2">
                            <span className="">IAESTE</span>
                            <span className="">{selectedCountry?.name}</span>
                        </div>
                    </button>
                    <button
                        className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 block lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <i className="fa-regular fa-circle-xmark text-3xl "></i>
                    </button>
                </li>
                {cards.map((card, index) =>
                    <li key={index} onClick={() => handleSelectCard(card.title)} className={`flex flex-row justify-between items-center p-3 border-b border-gray-300 hover-bg-gradient cursor-pointer text-[#1B75BB] text-xl font-semibold`}>
                        <span className="text-wrap">{card.title}</span>
                        <i className={`${card.icon} aria-hidden="true`} />
                    </li>
                )}
                <button
                    className="mx-auto cursor-pointer text-xl rounded-md border border-[#1B75BB] mt-4 w-full px-2.5 py-1 text-[#1B75BB] hover:text-white hover:bg-[#1B75BB]"
                    onClick={toggleSidebar}>
                    <i className="fa-solid fa-person-hiking mr-1"></i> Log out
                </button>
            </ul>
        </section>
    )
}

export default UserSidebar;