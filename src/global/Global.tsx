import { CardTempType, CardType, CountryType, SidebarSectionType } from "../types/types";
import { fetchCountryData } from "../service/CountryService";
import { confirmAlert } from "react-confirm-alert";
import "react-confirm-alert/src/react-confirm-alert.css";
import { UploadedFileType } from "../types/types"
import { storage } from "../firebase"; 
import { ref, uploadBytes, deleteObject } from "firebase/storage";
import { toast } from "react-toastify";

// interfaces
export interface CardProps {
    country: string
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
    { title: "General Information", icon: "fa fa-info-circle", header: "General Information", desc: "Manage general facts and descriptions for the country" },
    { title: "Cities With LCs", icon: "fa fa-city", header: "Cities with Local Committees", desc: "Manage cities where local committees are active" },
    { title: "Transportation", icon: "fa fa-train", desc: "Manage the country's transport - airports, international & national transport, public transport and discounts" },
    { title: "Recommended Places", icon: "fa fa-location-dot", desc:"Add and manage recommended places for the country" },
    { title: "Summer Reception", icon: "fa fa-umbrella-beach", desc: "Manage details for summer reception events and weekends" },
    { title: "Traditional Cuisine", icon: "fa fa-utensils", desc: "Explore and manage the country's traditional food and drinks"},
    { title: "Fun Facts", icon: "fa fa-brain", desc: "Add interesting and unique facts about the country" },
    { title: "Other Information", icon: "fa fa-file-circle-plus", desc: "Manage other interesting info about the country" },
    { title: "Gallery", icon: "fa fa-images", desc: "Showcase beautiful images of the country"},
]

export const TRANSPORT_CONSTANTS = {
    AIRPORTS: 1,
    NATIONAL_AND_INTERNATIONAL_TRANSPORT: 2,
    PUBLIC_TRANSPORT: 3,
    DISCOUNTS: 4
}

export const GENERAL_INFO_CONSTANTS: CardTempType[] = [ 
    {name: "Capital city", icon: "fa-solid fa-city"},
    {name: "Language", icon: "fa-solid fa-language"},
    {name: "Time zone", icon: "fa-solid fa-globe"},
    {name: "Currency", icon: "fa-solid fa-dollar-sign"},
    {name: "Voltage", icon: "fa-solid fa-bolt"},
    {name: "Dialing code", icon: "fa-solid fa-phone"},
    {name: "SIM providers", icon: "fa-solid fa-sim-card"},
    {name: "Population", icon: "fa-solid fa-users"},
    {name: "Climate", icon: "fa-solid fa-sun"},
]

export const EMERGENCY_CONTACTS_CONSTANTS: CardTempType[] = [
    { name: 'Police', icon: 'fa-solid fa-handcuffs' },
    { name: 'Ambulance', icon: 'fa-solid fa-truck-medical' },
    { name: 'Fire Department', icon: 'fa-solid fa-fire-extinguisher' },
    { name: 'Emergency Line', icon: 'fa-solid fa-phone' },
];

export const SOCIAL_LINKS_CONSTANTS: CardTempType[] = [
    { name: 'Instagram', icon: 'fab fa-instagram'},
    { name: 'Facebook', icon: 'fab fa-facebook'},
    { name: 'Website', icon: 'fas fa-globe'},
    { name: 'WhatsApp', icon: 'fab fa-whatsapp'},
    { name: 'Email Address', icon: 'fas fa-envelope'},
];

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
                name: country?.name ?? "",
                flag: country?.imageSrc ?? "",
                banner: country?.banner ?? "",
                pdf: country?.pdf ?? "",
                region: country?.region ?? ""
            }
    }
}

export const mapCountryCards = (country: CountryType | null | undefined): CardType[] => {
    // local helper function
    const checkIfSectionIsEmpty = (content: any): boolean => {
        if (!content?.hasOwnProperty("food") && !content?.hasOwnProperty("banner")) return !content.length
        if (content?.hasOwnProperty("food")) return !content.food.length && !content.drinks.length
        return content.banner === "" && content.pdf === ""
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

export async function handleCancel () {
    return await confirmModalWindow("All unsaved changes will be lost")
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

export const isList = (item: any) => Array.isArray(item)

export const uploadFileToStorage = async (countryName: string, uploadFile: UploadedFileType, folder: string) => {
    try {
        const storageRef = ref(storage, `${countryName}/${folder}/${uploadFile.file.name}`)
        await uploadBytes(storageRef, uploadFile.file)
        return uploadFile.dbUrl
    } catch (error) {
        toast.error("Error uploading files: " + error)
        return null
    }
}

export const removeFileFromStorage = async (file: string) => {
    try {
        await deleteObject(ref(storage, file))
    } catch(error) {
         toast.error("Error removing files from storage: " + error)
    }
}