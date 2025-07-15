export interface CountryType {
    id: string | number
    name: string
    href: string
    imageSrc: string
    imageAlt: string
    pdf: string
    banner?: string
    socialLinks: CardFormType[]
    cities: CityType[]
    committees: string[]
    emergencyContacts: EmergencyContactsType[]
    facts: string[]
    food: CuisineType[]
    drinks: CuisineType[]
    information: InformationType[]
    summerReception: WeekendType[]
    otherInformation: OtherType[]
    gallery: GalleryImageType[]
    transport: TransportType[]
    region: string
    users: UserType[]
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
    title: string
    number: string
}

export interface InformationType {
    name: string
    role: string
    icon?: string
}

export interface WeekendType {
    name: string
    startDate: string
    endDate: string
    location: string
    link: string
    limit: number
    description: string
    date?: string
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
    header?: string
    desc?: string
    sidebarTitle?: string
}

export interface CardFormType {
    name: string
    icon?: string
    value: string
    isSelect?: boolean
    options?: {value: string, display: string}[]
}

export interface SidebarSectionType {
    name: string,
    link: string,
    icon?: string
}

export interface CardTempType {
    name: string
    icon: string
}

export interface UploadedFileType {
    file: File
    url: string
    dbUrl: string
}

export interface UserType {
    uid: string
    email: string
    country: string
    role: "admin" | "user"
    createdAt: string
    lastLoggedIn: string
    test?: boolean
    disabled?: boolean
}

export interface FileUploadProps {
    type: "flag" | "banner" | "pdf"
    file: string
    fileToUpload: UploadedFileType | undefined
    fileToDelete: string
    column: keyof CountryType
    title: string
    defaultFile?: string
}

export interface TabProps {
    setIsChanged: (data: boolean) => void
    isChanged: boolean
    isLoading: boolean
    handleCancel: (resetData: () => void) => Promise<boolean>
}