import { CountryType } from "../types/types";
import { doc, getDoc, getDocs, collection, getFirestore, updateDoc, addDoc } from "firebase/firestore";
import { db } from "../firebase";
import { getCountryDbName } from "../global/Global";
import { fetchCountryUsers } from "./UsersService";
import { toast } from "react-toastify";

const COUNTRY_CACHE_KEY = "countryData"
const COUNTRIES_CACHE_KEY = "countriesData"

const fetchCountriesData = async (): Promise<CountryType[]> => {
    const querySnapshot = await getDocs(collection(db, "countries"))
    const result: CountryType[] = []
    querySnapshot.forEach((doc) => {
        const countryData = doc.data() as CountryType
        result.push(countryData)
    })
    localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(result))
    return result
}

export async function fetchDbData(): Promise<CountryType[]> {
    const storedData = localStorage.getItem(COUNTRIES_CACHE_KEY);
    return storedData ? JSON.parse(storedData) : fetchCountriesData();
}

export async function fetchCountryData(country: string): Promise<CountryType | undefined> {
    try {
        const countries = await fetchDbData()
        const foundCountry = countries.find((data: CountryType) => data.name === country)
        if (!foundCountry) throw new Error("Country not found!")

        foundCountry.users = await fetchCountryUsers(country)
        return foundCountry
    } catch (error) {
        toast.error("Error fetching country data! Message: " + error)
    }
}

export async function updateCountryField(country: string, content: any, column: keyof CountryType) {
    const db = getFirestore()
    const countryRef = doc(db, "countries", getCountryDbName(country))
    const docSnap = await getDoc(countryRef)

    if (docSnap.exists()) {

        await updateDoc(countryRef, {
            [column]: content
        })

        updateLocalStorageCountryData(country, column, content)
    } else throw new Error("Document not found!")
}

export function updateLocalStorageCountryData(updateCountry: string, updateColumn: keyof CountryType, updateContent: any) {
    const storedData = localStorage.getItem(COUNTRIES_CACHE_KEY);
    const countries: CountryType[] = JSON.parse(storedData!) || []; // Default to empty array if null

    // Find the index of the country you want to update
    const country = countries.find((c: CountryType) => c.name === updateCountry);

    if (country) {
        // Update the specified column with new content
        (country[updateColumn] as any) = updateContent
        // Update local storage with the modified countries array
        localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(countries));
    }
}

export async function fetchUnregisteredCountries() {
    const db = getFirestore()
    const queryCountriesSnapshot = await getDocs(collection(db, "countries"))
    const unregisteredCountries: string[] = []
    queryCountriesSnapshot.forEach((doc) => unregisteredCountries.push(doc.data().name))

    const queryUsersSnapshot = await getDocs(collection(db, "users"))
    queryUsersSnapshot.forEach(doc => {
        const data = doc.data()
        if (data.hasOwnProperty("country")) {
            const index = unregisteredCountries.findIndex(c => c === data.country)
            if (index !== -1) unregisteredCountries.splice(index, 1)
        }
    })
    return unregisteredCountries
}

export function clearCountryCache() {
    localStorage.removeItem(COUNTRY_CACHE_KEY)
}

export async function AddNewCountry(name: string, imageSrc: string, region: string) {
    const newCountry: CountryType = {
        name,
        imageSrc,
        region,
        href: `/${name}`,
        imageAlt: name.toLowerCase(),
        id: 0,
        pdf: "",
        socialLinks: [],
        cities: [],
        committees: [],
        emergencyContacts: [],
        facts: [],
        food: [],
        drinks: [],
        information: [],
        summerReception: [],
        otherInformation: [],
        gallery: [],
        transport: [],
        users: []
    }
    const docRef = await addDoc(collection(db, "countries"), newCountry)
    await fetchCountriesData()
    await updateCountryField(name, docRef.id, 'id')
}