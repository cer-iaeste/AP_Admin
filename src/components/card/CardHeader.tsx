import React from "react";

interface HeaderProps {
    country: string
    card?: string
}

const CardHeader: React.FC<HeaderProps> = ({ country, card }) => {
    return (
        <section>
            <div className="flex flex-col mt-1 sm:px-10 border-b border-gray-300 pb-0 sm:pb-4">
                <div className="text-3xl sm:text-5xl flex flex-col font-semibold text-[#1B75BB] text-start p-5 sm:p-0">
                    <span>IAESTE {country}</span>
                    <span>{card}</span>
                </div>
            </div>
        </section>
    )
}

export default CardHeader;