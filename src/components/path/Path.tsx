import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

interface PathProps {
    role: "admin" | "user"
}

interface PathElement {
    href?: (country: string) => void;
    text: JSX.Element; // Use JSX.Element for React elements
}

const Path: React.FC<PathProps> = ({ role }) => {
    const [pathElements, setPathElements] = useState<PathElement[]>([]);
    const { country, card } = useParams()
    const navigate = useNavigate();
    
    useEffect(() => {
        // reset the path elements
        const elements: PathElement[] = [];
        // add the country name
        if (country) {
            const countryName = country?.split(" ")[0]
            
            if (role === "admin") elements.push({ href: () => navigate(""), text: <i className="fa fa-house"></i> }) // add the house icon
            elements.push({ href: () => navigate(`${countryName}`), text: <span>{countryName}</span> }) // add the country name
            if (card) elements.push({ text: <span>{card}</span> }) // add the card
        } 
        // add elements to path
        setPathElements(elements)
    }, [country, card, role, navigate])

    return (
        <div className="flex items-center justify-between text-sm sm:text-base md:text-lg">
            <div className="text-[#1B75BB] gap-2 items-center py-1 w-full">
                {pathElements.map((el, index) =>
                    <button key={index} onClick={() => el.href} className="hover:text-sky-500 font-semibold ml-1 items-center">
                        {el.text}{(index < pathElements.length - 1) && " /"}
                    </button>
                )}
            </div>
        </div>

    )
}

export default Path;