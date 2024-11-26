import { CardType, CountryType } from "../types/types";
import { fetchCountryData } from "../service/CountryService";

// interfaces
export interface CardProps {
    country: string
    handleAddNewItem: (setData: (data: any) => void, data: any, newItem: any, setIsChanged: (state: boolean) => void, index?: number) => void
    handleSave: (country: string, data: any, column: keyof CountryType, title: string, setIsChanged: (state: boolean) => void) => void
    handleDelete: (index: number, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void, itemIndex?: number) => boolean
    handleCancel: (setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => void
    handleBack: (isChanged: boolean, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => void
    handleInputChange: (setData: (data: any) => void, data: any, index: number, value: any, setIsChanged: (state: boolean) => void, column?: string, itemIndex?: number) => void
}

// constants
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

//functions
export const loadingTimer = (setIsLoading: (status: boolean) => void) => {
    const timer = setTimeout(() => {
        setIsLoading(false)
    }, 1100);

    return () => clearTimeout(timer)
}

export const getCardContent = (country: CountryType | null | undefined, title: string): any => {
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

export const mapCountryCards = (country: CountryType | null | undefined): CardType[] => {
    // local helper function
    const checkIfSectionIsEmpty = (content: any): boolean => {
        if (!content.hasOwnProperty("food")) return !content.length
        return !content.food.length || !content.drinks.length
    }

    return country ? 
        componentsCards.map((card: CardType) => {
            const content = getCardContent(country, card.title)
            return ({...card, isSectionEmpty: checkIfSectionIsEmpty(content)})
        })
        : []
}

export const getCard = (country: CountryType | undefined, card: string | undefined, setSelectedCard: (data: CardType) => void): void => {
    const selectedCard = componentsCards.find(c => c.title === card)
    if (selectedCard)
        setSelectedCard({
            ...selectedCard,
            content: getCardContent(country, selectedCard?.title)
        })
}

export const emptyLocalStorage = () => localStorage.clear()

export const getCountryData = async (country: string | undefined | null, setCountry: (data: CountryType) => void, setIsLoading?: (state: boolean) => void) => {
    if (country) {
        if (setIsLoading) setIsLoading(true)
        const data = await fetchCountryData(country)
        if(data) setCountry(data)
    }
}