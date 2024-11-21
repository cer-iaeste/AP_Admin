import { CardType } from "../types/types";

export const componentsCards: CardType[] = [
    // { title: "Hero Banner", icon: "fa fa-chalkboard" },
    { title: "Emergency Numbers", icon: "fa fa-phone" },
    { title: "General Information", icon: "fa fa-info-circle" },
    { title: "Cities With LCs", icon: "fa fa-city" },
    { title: "Transportation", icon: "fa fa-train" },
    { title: "Recommended Places", icon: "fa fa-location-dot" },
    { title: "Summer Reception", icon: "fa fa-umbrella-beach" },
    { title: "Traditional Cuisine", icon: "fa fa-utensils" },
    { title: "Fun Facts", icon: "fa fa-brain" },
    { title: "Other Information", icon: "fa fa-file-circle-plus" },
    { title: "Gallery", icon: "fa fa-images" },
]

export const loadingTimer = (setIsLoading: (status: boolean) => void) => {
    const timer = setTimeout(() => {
        setIsLoading(false)
    }, 1100);

    return () => clearTimeout(timer)
}

export const TRANSPORT_CONSTANTS = {
    AIRPORTS: 1,
    NATIONAL_AND_INTERNATIONAL_TRANSPORT: 2,
    PUBLIC_TRANSPORT: 3,
    DISCOUNTS: 4
}

export const EMERGENCY_NUMBERS_CONSTANTS = {
    "Ambulance": 1,
    "Police": 2,
    "Fire Department": 3,
    "Emergency Line": 4
}

export const GENERAL_INFO_CONSTANTS  = [
    "Capital city",
    "Language",
    "Time zone",
    "Currency",
    "Voltage",
    "Climate",
    "Country dialing code",
    "SIM card providers",
    "Population"
]