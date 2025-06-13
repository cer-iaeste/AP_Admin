import { CardType, CountryType, SidebarSectionType } from "../types/types";
import { fetchCountryData } from "../service/CountryService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import cerLogo from "../images/cer-logo.png"
import iaesteLogo from "../images/iaeste-logo.jpg"

// interfaces
export interface CardProps {
    country: string
    save?: boolean
    cancel?: boolean
    handleChange?: (state: boolean) => void
    handleAddNewItem: (setData: (data: any) => void, data: any, newItem: any, setIsChanged: (state: boolean) => void, index?: number) => void
    handleSave: (country: string, data: any, column: keyof CountryType, title: string, setIsChanged: (state: boolean) => void) => void
    handleDelete: (index: number, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void, itemIndex?: number) => Promise<boolean>
    handleCancel: (isChanged: boolean, setData: (data: any) => void, data: any, setIsChanged: (state: boolean) => void) => Promise<boolean>
    handleInputChange: (setData: (data: any) => void, data: any, index: number, value: any, setIsChanged: (state: boolean) => void, column?: string, itemIndex?: number) => void
}

// constants
export const componentsCards: CardType[] = [
    { title: "Banner", icon: "fa fa-chalkboard", header: "Hero Banner Details", desc: "Manage the main banner image & country PDF settings"},
    { title: "Social Links", icon: "fa fa-share-nodes", header: "Social Media & Contact Links", desc: "Manage links to social media and contact information"},
    { title: "Emergency Numbers", icon: "fa fa-phone", header: "Emergency Numbers", desc: "Manage essential emergency contact numbers for the country" },
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

export const GENERAL_INFO_CONSTANTS = [
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

export const SIDEBAR_SECTIONS: SidebarSectionType[] = [
    {name: "Admin Panel", icon: "fa-solid fa-home", link:"/"},
    {name: "AP Countries", icon: "fa-solid fa-earth-europe", link: "/countries"},
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
        case "Social Links":
            return country?.socialLinks ?? []
        case "Traditional Cuisine":
            return {
                food: country?.food ?? [],
                drinks: country?.drinks ?? []
            }
        default:
            return {
                banner: country?.banner ?? "",
                pdf: country?.pdf ?? "",
                // socialLinks: country?.socialLinks ?? []
            }
    }
}

export const mapCountryCards = (country: CountryType | null | undefined): CardType[] => {
    // local helper function
    const checkIfSectionIsEmpty = (content: any): boolean => {
        if (!content?.hasOwnProperty("food") && !content?.hasOwnProperty("banner")) return !content.length
        if (content?.hasOwnProperty("food")) return !content.food.length && !content.drinks.length
        return content.banner === "" && content.pdf === "" && !content.socialLinks.length
    }

    return country ?
        componentsCards.map((card: CardType) => {
            const content = getCardContent(country, card.title)
            return ({ ...card, isSectionEmpty: checkIfSectionIsEmpty(content) })
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

export const emptyLocalStorage = () => {
    localStorage.removeItem("countriesData")
    localStorage.removeItem("authToken");
    localStorage.removeItem("loggedIn");
}

export const getCountryData = async (country: string | undefined | null, setCountry: (data: CountryType) => void, setIsLoading?: (state: boolean) => void) => {
    if (country) {
        const countryName = country.replace(/%20/g, " ")
        if (setIsLoading) setIsLoading(true)
        const data = await fetchCountryData(countryName)
        if (data) setCountry(data)
    }
}

export const confirmModalWindow = (message: string): Promise<boolean> => {
    return new Promise((resolve) => {
        confirmAlert({
            customUI: ({ onClose }) => {
                return (
                    <div className="bg-white rounded-lg shadow-lg p-6 min-w-md mx-auto justify-center flex flex-col">
                        <h2 className="text-2xl font-bold text-gray-800 mb-4">Are you sure?</h2>
                        <p className="text-gray-600 mb-6">{message}</p>
                        <div className="flex justify-end space-x-3 font-semibold">
                            <button
                                onClick={() => {
                                    resolve(false)
                                    onClose()
                                }}
                                className="px-4 py-2 text-sm text-gray-700 bg-gray-200 rounded hover:bg-gray-300"
                            >
                                No
                            </button>
                            <button
                                onClick={() => {
                                    resolve(true)
                                    onClose()
                                }}
                                className="px-4 py-2 text-sm text-white bg-red-600 rounded hover:bg-red-700"
                            >
                                Yes
                            </button>
                        </div>
                    </div>
                )
            }
        })
    })
}

export const getCountryDbName = (country: string): string => {
    switch (country) {
        case "Bosnia & Herzegovina":
            return "Bosnia"
        case "Czech Republic":
            return "Czechia"
        case "Turkiye":
            return "Turkey"
        default:
            return country
    }
}

export const scrollToBottom = () => {
    setTimeout(() => {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: "smooth",
    })}, 150)
}