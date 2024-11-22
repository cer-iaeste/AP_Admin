import { CountryType } from "../types/types";
import { doc, getDoc, getDocs, collection, getFirestore, updateDoc } from "firebase/firestore";
import { db } from "../firebase";

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

export async function fetchCountryData(country: string): Promise<CountryType | null> {
    const cachedData = localStorage.getItem(COUNTRIES_CACHE_KEY)
    if (cachedData) {
        const parsedData = JSON.parse(cachedData)
        const result = parsedData.find((data: CountryType) => data.name === country)
        console.log(result)
        return result
    }

    try {
        // Reference to the specific document "Austria" in the "countries" collection
        const docRef = doc(db, "countries", "Austria")
        // Fetch the document data
        const docSnap = await getDoc(docRef)
        // Set the data from the document
        if (docSnap.exists()) {
            const countryData = docSnap.data() as CountryType
            // update local storage
            const updatedCache = cachedData ? JSON.parse(cachedData) : {}
            updatedCache[country] = countryData
            localStorage.setItem(COUNTRY_CACHE_KEY, JSON.stringify(updatedCache))

            return countryData

        } else throw new Error("Failed to fetch country data!")
    } catch (error) {
        console.error("Error fetching country data: " + country + "; error: " + error)
        return null;
    }
}

export async function updateCountryField(country: string, content: any, column: keyof CountryType, columnName: string) {
    const db = getFirestore()
    const countryRef = doc(db, "countries", country)
    const docSnap = await getDoc(countryRef)
    if (docSnap.exists()) {

        await updateDoc(countryRef, {
            [column]: content
        })

        updateLocalStorageCountryData(country, column, content)

        alert(`${columnName} updated successfully!`)

    } else alert("Document not found!")
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