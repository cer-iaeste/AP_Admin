import React, { useEffect, useState } from "react";
import { CardType, CountryType } from "../../types/types";
import "../../App.css"
import { mapCountryCards } from "../../global/Global";
import { fetchCountryData } from "../../service/CountryService";

interface SidebarProps {
    isOpen: boolean
    selectCard: (card: string, data: any[]) => void
    selectedCountry: string
    toggleSidebar: () => void
}

const UserSidebar: React.FC<SidebarProps> = ({ isOpen, selectCard, selectedCountry, toggleSidebar }) => {
    const [country, setCountry] = useState<CountryType | null>(null);
    const [cards, setCards] = useState<CardType[]>([])

    useEffect(() => {
        const fetchData = async () => {
            const data = await fetchCountryData(selectedCountry)
            if (data) setCountry(data)
        }
        fetchData()
    }, [selectedCountry]);

    useEffect(() => {
        setCards(mapCountryCards(country))
    }, [country])

    const handleSelectCard = (card: string, content: any[]) => selectCard(card, content)


    return (
        <section className={`fixed z-20 top-0 left-0 bg-[#F1F1E6] border-r border-[#1B75BB] w-64 max-h-screen min-h-full overflow-y-scroll transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ scrollbarWidth: "thin" }}
        >
            <ul>
                <li key="admin" className="border-b-2 px-2 text-2xl font-semibold flex justify-between">
                    <div className="flex items-center justify-center">
                        <img src={country?.imageSrc} alt={selectedCountry} className="rounded-full h-10 w-10 border" />
                        <div className="flex flex-col font-bold text-[#1B75BB] text-left ml-2">
                            <span className="">IAESTE</span>
                            <span className="">{selectedCountry}</span>
                        </div>
                    </div>
                    <button
                        className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 block lg:hidden"
                        onClick={toggleSidebar}
                    >
                        <i className="fa-regular fa-circle-xmark text-3xl "></i>
                    </button>
                </li>
                {cards.map((card, index) =>
                    <li key={index} data-name={card.title} onClick={() => handleSelectCard(card.title, card.content ?? [])} className={`flex flex-row justify-between items-center p-3 border-b border-gray-300 hover-bg-gradient cursor-pointer text-[#1B75BB] text-xl font-semibold`}>
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