import { useState, useEffect } from "react";
import AdminNavbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import Landing from "../landing/Landing";
import useWindowSize from "../../hooks/useScreenSize"
import { Routes, Route, useNavigate } from "react-router-dom";
import Country from "../country/Country";
import Card from "../card/Card";
import { CountryType } from "../../types/types";
import { loadingTimer } from "../../global/Global";
import { fetchDbData } from "../../service/CountryService";
import "../../App.css"

const AdminPanel = () => {
    const { width } = useWindowSize()
    // const location = useLocation();
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [countries, setCountries] = useState<CountryType[]>([])
    const [country, setCountry] = useState("")
    const [card, setCard] = useState("")
    const [content, setContent] = useState<any[]>([])

    const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen)

    const selectCountry = (selectedCountry: string): void => {
        setCountry(selectedCountry)
        setCard("")
        if (width <= 1024) setIsSidebarOpen(false)
    }

    const selectCard = (selectedCard: string, data: any[]): void => {
        setContent(data)
        setCard(selectedCard)
    }

    // reset the values of the country and card and navigate back to home page
    const navigateHome = (): void => {
        setCard("")
        setCountry("")
    }
    // reset the card value and navigate back to country menu cards
    const navigateCountry = (): void => setCard("")

    useEffect(() => {
        setIsSidebarOpen(width > 1024);
        setIsLoading(false)
    }, [width])

    // useEffect(() => {
    //     if (location.pathname === "/") setCountry("")
    //     else if (!country) {
    //         const pathSegments = location.pathname.split("/")
    //         if (pathSegments.length >= 3 && pathSegments[2]) {
    //             const countryName = pathSegments[2].replaceAll("%20", " ")
    //             setCountry(countryName)
    //         }
    //     }
    // }, [location, country])

    useEffect(() => {
        const fetchData = async () => {
            if (countries.length === 0) {
                console.log("Fetch data")
                setIsLoading(true)
                const data = await fetchDbData()
                setCountries(data)
                loadingTimer(setIsLoading)
            }
        }
        fetchData()
    }, [countries]);

    useEffect(() => {
        let navigationLink = "/"
        if (country) {
            navigationLink += `${country}`
            if (card) navigationLink += `/${card}`
        }
        navigate(navigationLink)
    }, [card, country, navigate])

    return (
        !isLoading
            ? <section className="flex flex-row">
                <Sidebar isOpen={isSidebarOpen} country={country} selectCountry={selectCountry} countries={countries} navigateHome={navigateHome} toggleSidebar={toggleSidebar}/>
                <div className={`w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                    <AdminNavbar toggleSidebar={toggleSidebar} navigateHome={navigateHome} navigateCountry={navigateCountry} country={country} card={card}/>
                    <Routes>
                        <Route path="/" element={<Landing />} />
                        <Route path="/:country" element={<Country selectedCountry={country} selectCard={selectCard} />} />
                        <Route path="/:country/:card" element={<Card selectedCountry={country} selectedCard={card} content={content} />} />
                    </Routes>
                </div>
                {/* For mobile view*/}
                {isSidebarOpen && width <= 1024 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar}></div>
                )}
            </section>
            : null
    );
}

export default AdminPanel