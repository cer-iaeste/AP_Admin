import React, { useEffect, useState } from "react";
import Back from "../../global/Back";
import { CardType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";

interface HeaderProps {
    isChanged: boolean
    country: string
    card?: CardType
}

const CardHeader: React.FC<HeaderProps> = ({ isChanged, country, card }) => {
    const [isMobile, setIsMobile] = useState<boolean>(false)
    const { width } = useWindowSize()

    useEffect(() => {
        setIsMobile(width < 768)
    }, [width])

    return (
        isMobile ? (
            <section>
                <div className="absolute top-0 left-0 z-20 border-gray-200 bg-sky-100 w-full flex flex-row justify-start gap-4 font-bold p-3 text-xl">
                    <Back confirmationNeeded={isChanged} isMobile={isMobile} />
                    <span>IAESTE {country}</span>
                </div>
                <div className="flex flex-col justify-start text-start md:text-left relative mt-12 mb-4">
                    <span className="font-semibold text-3xl lg:text-4xl text-gray-800">{card?.header ?? card?.title}</span>
                    <span>{card?.desc}</span>
                </div>
            </section>

        ) : (
            <div className="flex flex-col justify-center text-center md:text-left relative">
                <Back confirmationNeeded={isChanged} countryName={`IAESTE ${country}`}/>

                <span className="font-semibold text-3xl lg:text-4xl text-gray-800 mt-16 sm:mt-20">{card?.header ?? card?.title}</span>
                <div className="font-bold items-center text-lg mt-2 flex justify-center md:justify-start mt-4">
                    <i className="fa fa-circle-info mr-3 text-2xl"></i>
                    <span>{card?.desc}</span>
                </div>
            </div>
        )

    )
}

export default CardHeader;