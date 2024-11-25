import { useState, useEffect } from "react";
import AdminNavbar from "../navbar/Navbar";
import Sidebar from "../sidebar/Sidebar";
import UserSidebar from "../sidebar/UserSidebar";
import Landing from "../landing/Landing";
import useWindowSize from "../../hooks/useScreenSize"
import { Routes, Route, useNavigate } from "react-router-dom";
import Country from "../country/Country";
import Card from "../card/Card";
import { CountryType } from "../../types/types";
import { loadingTimer } from "../../global/Global";
import { fetchDbData } from "../../service/CountryService";
import "../../App.css"
import ProtectedRoute from "../../service/ProtectedRoute";

const AdminPanel = () => {
    const { width } = useWindowSize()
    const [role, setRole] = useState<"admin" | "user">("user")
    const navigate = useNavigate();

    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)

    const [countries, setCountries] = useState<CountryType[]>([])
    const [country, setCountry] = useState("")
    const [card, setCard] = useState("")
    const [content, setContent] = useState<any[]>([])
    const [countryImg, setCountryImg] = useState<string>("")

    const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen)

    const selectCountry = (selectedCountry: string): void => {
        setCountry(selectedCountry)
        setCard("")
        if (width <= 1024) setIsSidebarOpen(false)
    }

    const selectCard = (selectedCard: string, data: any[], imgSrc: string): void => {
        setContent(data)
        setCountryImg(imgSrc)
        setCard(selectedCard)
        if (width <= 1024) setIsSidebarOpen(false)
    }

    // reset the values of the country and card and navigate back to home page
    const navigateHome = (): void => {
        setCard("")
        setCountryImg("")
        setCountry("")
    }
    // reset the card value and navigate back to country menu cards
    const navigateCountry = (): void => setCard("")

    useEffect(() => {
        setIsSidebarOpen(false);
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
                setIsLoading(true)
                const data = await fetchDbData()
                setCountries(data)
                loadingTimer(setIsLoading)
            }
        }
        fetchData()
    }, []);
    

    useEffect(() => {
        let navigationLink = "/"
        if (country) {
            navigationLink += `${country}`
            if (card) navigationLink += `/${card}`
        }
        navigate(navigationLink)
    }, [card, country, navigate])

    
    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn')
        if (loggedIn) {
            const user = JSON.parse(loggedIn)
            setRole(user.role)
            selectCountry(user.country ?? "")
        }
    }, []); 

    return (
        !isLoading
            ? <section className="flex flex-row">
                {role === "user" ?
                    <UserSidebar isOpen={isSidebarOpen} selectedCountry={country} selectCard={selectCard} toggleSidebar={toggleSidebar}/>
                    : <Sidebar isOpen={isSidebarOpen} country={country} selectCountry={selectCountry} countries={countries} toggleSidebar={toggleSidebar} navigateHome={navigateHome}/>
                }
                <div className={`w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                    <AdminNavbar toggleSidebar={toggleSidebar} navigateHome={navigateHome} navigateCountry={navigateCountry} role={role} country={country} card={card} />
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute requiredRole="admin">
                                <Landing countries={countries} selectCountry={selectCountry}/>
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/:country" element={
                            <ProtectedRoute requiredRole="user" requiredCountry={country}>
                                <Country selectedCountry={country} selectCard={selectCard} />
                            </ProtectedRoute>
                        } />
                        <Route path="/:country/:card" element={
                            <ProtectedRoute requiredRole="user" requiredCountry={country}>
                                <Card selectedCountry={country} selectedCard={card} content={content} selectedCountryImgSrc={countryImg} navigateCountry={navigateCountry}/>
                            </ProtectedRoute>
                        } />
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