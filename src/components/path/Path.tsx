import React, { useEffect, useState } from "react";

interface PathProps {
    navigateHome: () => void
    navigateCountry: () => void
    country?: string
    card?: string
}

interface PathElement {
    href?: () => void;
    text: JSX.Element; // Use JSX.Element for React elements
}

const Path: React.FC<PathProps> = ({ navigateHome, navigateCountry, country, card }) => {
    const [pathElements, setPathElements] = useState<PathElement[]>([]);

    useEffect(() => {
        // reset the path elements
        const elements: PathElement[] = [];
        // add the country name
        if (country) {
            elements.push(
                { href: navigateHome, text: <i className="fa fa-house"></i> }, // add the house icon
                { href: navigateCountry, text: <span>{country}</span> } // add the country name
            )
            if (card) elements.push({ text: <span>{card}</span> }) // add the card
        } 
        // add elements to path
        setPathElements(elements)
    }, [country, card, navigateHome, navigateCountry])

    return (
        <div className="flex items-center justify-between text-sm sm:text-base md:text-lg">
            <div className="text-[#1B75BB] gap-2 items-center py-1">
                {pathElements.map((el, index) =>
                    <button key={index} onClick={el.href} className="hover:text-sky-500 font-semibold ml-1 items-center">
                        {el.text}{(index < pathElements.length - 1) && " /"}
                    </button>
                )}
            </div>
        </div>

    )
}

export default Path;