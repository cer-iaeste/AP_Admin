import { CountryType } from "../types/types";
import { doc, getDoc, getDocs, collection, getFirestore, updateDoc } from "firebase/firestore";
import { db } from "../firebase";
import { toast } from 'react-toastify';

const COUNTRY_CACHE_KEY = "countryData"
const COUNTRIES_CACHE_KEY = "countriesData"

export async function fetchDbData(): Promise<CountryType[]> {
    const storedData = localStorage.getItem(COUNTRIES_CACHE_KEY);

    if (storedData) return JSON.parse(storedData)

    const fetchCountriesData = async () : Promise<CountryType[]> => {
        const querySnapshot = await getDocs(collection(db, "countries"))
        const result: CountryType[] = []
        querySnapshot.forEach((doc) => {
            const countryData = doc.data() as CountryType
            result.push(countryData)
        })
        localStorage.setItem(COUNTRIES_CACHE_KEY, JSON.stringify(result))
        return result
    }


    return fetchCountriesData();
}

export async function fetchCountryData(country: string): Promise<CountryType | undefined> {
    const countries = await fetchDbData()
    return countries.find((data: CountryType) => data.name === country)
}

export async function updateCountryField(country: string, content: any, column: keyof CountryType, columnName: string) {
    const db = getFirestore()

    let countryName = country
    if (country === "Bosnia & Herzegovina") countryName = "Bosnia"
    else if (country === "Czech Republic") countryName = "Czechia"

    const countryRef = doc(db, "countries", countryName)
    const docSnap = await getDoc(countryRef)
    if (docSnap.exists()) {

        await updateDoc(countryRef, {
            [column]: content
        })

        updateLocalStorageCountryData(country, column, content)

        toast.success(`${columnName} updated successfully!`)

    } else toast.error("Document not found!")
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



export function clearCountryCache() {
    localStorage.removeItem(COUNTRY_CACHE_KEY)
}