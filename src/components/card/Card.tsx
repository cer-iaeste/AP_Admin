import React, { useState, useEffect, ReactElement } from "react";
import Loader from "../loader/Loader";
import CardHeader from "./CardHeader";
import "./Card.css"
import EmergencyContacts from "../emergency-contacts/EmergencyContacts";
import CitiesWithLcs from "../committees/CitiesWithLcs";
import GeneralInfo from "../general-info/GeneralInfo";
import FunFacts from "../fun-facts/FunFacts";
import Places from "../recommended-places/Places";
import Other from "../other/Other";
import Cuisine from "../cuisine/Cuisine";
import Transport from "../transport/Transport";
import SummerReception from "../summer-reception/SummerReception";
import Gallery from "../gallery/Gallery";

interface CardProps {
    selectedCountry: string
    selectedCard: string
    content: any
}

const Card: React.FC<CardProps> = ({ selectedCountry, selectedCard, content }) => {
    const [isLoading, setIsLoading] = useState(true);
    const [country, setCountry] = useState("");
    const [card, setCard] = useState("");
    const [cardComponent, setCardComponent] = useState<ReactElement>()

    useEffect(() => {
        const timer = setTimeout(() => {
            setCard(selectedCard);
            setCountry(selectedCountry);
            // add the proper card component
            switch (selectedCard) {
                case "Emergency Numbers":
                    setCardComponent(<EmergencyContacts emergencyContacts={content} country={selectedCountry} />)
                    break
                case "Cities With LCs":
                    setCardComponent(<CitiesWithLcs cities={content} country={selectedCountry} />)
                    break
                case "General Information":
                    setCardComponent(<GeneralInfo information={content} country={selectedCountry} />)
                    break
                case "Fun Facts":
                    setCardComponent(<FunFacts facts={content} country={selectedCountry} />)
                    break
                case "Recommended Places":
                    setCardComponent(<Places places={content} country={selectedCountry} />)
                    break
                case "Other Information":
                    setCardComponent(<Other other={content} country={selectedCountry} />)
                    break
                case "Traditional Cuisine":
                    setCardComponent(<Cuisine cuisine={content} country={selectedCountry} />)
                    break
                case "Transportation":
                    setCardComponent(<Transport transport={content} country={selectedCountry} />)
                    break
                case "Summer Reception":
                    setCardComponent(<SummerReception summerReception={content} country={selectedCountry} />)
                    break
                default:
                    setCardComponent(<Gallery images={content} country={selectedCountry} />)
                    break
            }

            setIsLoading(false);
        }, 1100);
        return () => clearTimeout(timer);
    }, [selectedCountry, selectedCard, content]);

    return (
        <section className="section">
            {isLoading ? (
                <Loader />
            ) : (
                <section className="p-1 bg-sky-100">
                    <div className="container">
                        <div className="elements-position">
                            <CardHeader country={country} card={card} />

                            {cardComponent}

                        </div>
                    </div>
                </section>
            )}
        </section>
    )

}

export default Card;