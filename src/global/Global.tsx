import { CardType, CountryType } from "../types/types";

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

export const mapCountryCards = (country: CountryType | null): CardType[] => {
     // local helper function
    const getCardContent = (title: string): any => {
        switch (title) {
            case "Emergency Numbers":
                return country?.emergencyContacts ?? []
            case "General Information":
                return country?.information ?? []
            case "Cities With LCs":
                return country?.committees ?? []
            case "Transportation":
                return country?.transport ?? []
            case "Recommended Places":
                return country?.cities ?? []
            case "Summer Reception":
                return country?.summerReception ?? []
            case "Fun Facts":
                return country?.facts ?? []
            case "Other Information":
                return country?.otherInformation ?? []
            case "Gallery":
                return country?.gallery ?? []
            case "Traditional Cuisine":
                return {
                    food: country?.food ?? [],
                    drinks: country?.drinks ?? []
                }
            default:
                return [];
        }
    }
     // local helper function
    const checkIfSectionIsEmpty = (content: any): boolean => {
        if (!content.hasOwnProperty("food")) return !content?.length
        return !content.food.length || !content.drinks.length
    }


    if (country) return componentsCards.map((card: CardType) => {
        const content = getCardContent(card.title)
        const isSectionEmpty = checkIfSectionIsEmpty(content)
        return ({...card, content, isSectionEmpty})
    })

    return []
}