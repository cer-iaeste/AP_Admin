import React from "react";
import Back from "../../global/Back";
import { CardType } from "../../types/types";

interface HeaderProps {
    isChanged: boolean
    country: string
    card?: CardType
}

const CardHeader: React.FC<HeaderProps> = ({ isChanged, country, card }) => {
    return (
        <div className="flex flex-col justify-center text-center md:text-left relative">
            <Back confirmationNeeded={isChanged} />
            <span className="font-semibold text-4xl lg:text-5xl text-gray-800 mt-16 sm:mt-20">IAESTE {country}</span>
            <span className="font-semibold text-3xl lg:text-4xl text-gray-800">{card?.header ?? card?.title}</span>
            <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start mt-4">
                <i className="fa fa-circle-info mr-3 text-2xl"></i>
                <span>{card?.desc}</span>
            </div>
        </div>
    )
}

export default CardHeader;