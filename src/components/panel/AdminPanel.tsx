import { useState, useEffect } from "react";
import Sidebar from "../sidebar/Sidebar";
import UserSidebar from "../sidebar/UserSidebar";
import Landing from "../landing/Landing";
import useWindowSize from "../../hooks/useScreenSize"
import { Routes, Route } from "react-router-dom";
import Country from "../country/Country";
import Card from "../card/Card";
import { CountryType } from "../../types/types";
import { loadingTimer } from "../../global/Global";
import { fetchDbData } from "../../service/CountryService";
import "../../App.css"
import ProtectedRoute from "../../service/ProtectedRoute";
import Countries from "../countries/Countries";
import AddCountry from "../add-country/AddCountry";
import { useNavigate, useLocation } from "react-router-dom";
import Navbar from "../navbar/Navbar";

const AdminPanel = () => {
    const { width } = useWindowSize()
    const [role, setRole] = useState<"admin" | "user">("user")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [countries, setCountries] = useState<CountryType[]>([])
    const navigate = useNavigate();
    const location = useLocation();

    const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen)

    const back = (): void => {
        if (location.pathname !== "/") navigate(-1)
    }

    useEffect(() => {
        setIsSidebarOpen(width > 1024);
        setIsLoading(false)
    }, [width])

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
    }, [countries]);

    useEffect(() => {
        const loggedIn = localStorage.getItem('loggedIn')
        if (loggedIn) {
            const user = JSON.parse(loggedIn)
            setRole(user.role)
        }
    }, []);

    return (
        !isLoading
            ? <section className="flex flex-row bg-sky-100 min-h-screen">
                {role === "user" ?
                    <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                    : <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />
                }
                <div className={`w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-48" : "ml-0"}`}>
                    <Navbar toggleSidebar={toggleSidebar} back={back} pathname={location.pathname} isSidebarOpen={isSidebarOpen} width={width} />
                    
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Landing />
                            </ProtectedRoute>

                        } />
                        <Route path="/:section" element={
                            <ProtectedRoute>
                                <Countries countries={countries} />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/new" element={
                            <ProtectedRoute>
                                <AddCountry  />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/:country" element={
                            <ProtectedRoute>
                                <Country />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/:country/:card" element={
                            <ProtectedRoute>
                                <Card />
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