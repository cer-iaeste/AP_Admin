import { useState, useEffect } from 'react';
import { useLocation } from "react-router-dom";

export default function useCountryFromUrl() {
    const [countryName, setCountryName] = useState<string>("");
    const location = useLocation();

    useEffect(() => {
        const pathSegments = location.pathname.split("/").filter(Boolean);
        setCountryName(pathSegments[1] ?? ""); 
    }, [location]);

    return countryName;
}
