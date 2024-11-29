export interface CountryType {
    id: number
    name: string
    href: string
    imageSrc: string
    imageAlt: string
    pdf: string
    banner?: string
    socialLinks: {[key: string]: string}[]
    cities: CityType[]
    committees: string[]
    emergencyContacts: EmergencyContactsType[]
    facts: string[]
    food: CuisineType[]
    drinks: CuisineType[]
    information: InformationType[]
    summerReception: WeekendType[]
    otherInformation: CuisineType[]
    gallery: GalleryImageType[]
    transport: TransportType[]
}

export interface CityType {
    name: string
    description: string
}

export interface OtherType {
    title: string
    description: string
}

export interface CuisineType {
    food: OtherType[]
    drinks: OtherType[]
}

export interface EmergencyContactsType {
    [key: string] : string
}

export interface InformationType {
    name: string
    role: string
    imageUrl?: string
}

export interface WeekendType {
    name: string
    startDate: string
    endDate: string
    location: string
    link: string
    limit: number
    description: string
}

export interface GalleryImageType {
    imageUrl: string
    isDefault?: boolean
}

export interface TransportFeature {
    name: string
    link?: string
}

export interface TransportType {
    id: number
    features: TransportFeature[]
}

export interface CardType {
    title: string
    icon: string
    content?: any
    isSectionEmpty?: boolean
}