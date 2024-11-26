import { useState, useEffect } from "react";
import AdminNavbar from "../navbar/Navbar";
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

const AdminPanel = () => {
    const { width } = useWindowSize()
    const [role, setRole] = useState<"admin" | "user">("user")
    const [isSidebarOpen, setIsSidebarOpen] = useState(false)
    const [isLoading, setIsLoading] = useState(true)
    const [countries, setCountries] = useState<CountryType[]>([])

    const toggleSidebar = (): void => setIsSidebarOpen(!isSidebarOpen)

    useEffect(() => {
        setIsSidebarOpen(false);
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
            ? <section className="flex flex-row">
                {role === "user" ?
                    <UserSidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar}/>
                    : <Sidebar isOpen={isSidebarOpen} countries={countries} toggleSidebar={toggleSidebar}/>
                }
                <div className={`w-full transition-all duration-300 ${isSidebarOpen ? "lg:ml-64" : "ml-0"}`}>
                    <AdminNavbar toggleSidebar={toggleSidebar} role={role}/>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Landing countries={countries}/>
                            </ProtectedRoute>
                            
                        } />
                        <Route path="/:country" element={
                            <ProtectedRoute>
                                <Country/>
                            </ProtectedRoute>
                        } />
                        <Route path="/:country/:card" element={
                            <ProtectedRoute>
                                <Card/>
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