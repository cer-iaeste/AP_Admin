import React from "react";

interface HeaderProps {
    country: string
    card?: string
    imgSrc?: string
}

const CardHeader: React.FC<HeaderProps> = ({ country, card, imgSrc }) => {
    return (
        <section>
            <div className="flex flex-col mt-1 sm:px-10 border-b border-gray-300 pb-0 sm:pb-4">
                <div className="flex items-center justify-start w-full ">
                    <img src={imgSrc} alt={country} className="rounded-full h-20 w-20 sm:h-32 sm:w-32 border" />
                    <div className="flex flex-col ml-5 font-bold text-[#1B75BB] text-left">
                        <span className="text=xl sm:text-3xl">IAESTE {country}</span>
                        <span className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl">{card}</span>
                    </div>
                </div>
            </div>
        </section>
    )
}

export default CardHeader;