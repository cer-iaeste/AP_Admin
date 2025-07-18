import { useState, useEffect, useMemo } from "react";
import Sidebar from "../sidebar/Sidebar";
import UserSidebar from "../sidebar/UserSidebar";
import Landing from "../landing/Landing";
import useWindowSize from "../../hooks/useScreenSize"
import { Routes, Route } from "react-router-dom";
import Country from "../country/Country";
import Card from "../card/Card";
import { CountryType, UserType } from "../../types/types";
import { loadingTimer, formatDate } from "../../global/Global";
import { fetchDbData } from "../../service/CountryService";
import { fetchUsersData } from "../../service/UsersService";
import "../../App.css"
import ProtectedRoute from "../../service/ProtectedRoute";
import Countries from "../countries/Countries";
import AddCountry from "../add-country/AddCountry";
import Users from "../users/Users";
import AddUser from "../users/AddUser";

const AdminPanel = () => {
    const { width } = useWindowSize()
    const [role, setRole] = useState<"admin" | "user">("user")
    const [isSidebarOpen, setIsSidebarOpen] = useState(true)
    const [isLoading, setIsLoading] = useState(true)
    const [countries, setCountries] = useState<CountryType[]>([])
    const [users, setUsers] = useState<UserType[]>([])

    useEffect(() => {
        setIsSidebarOpen(width > 348);
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

    useEffect(() => {
        const fetchData = async () => {
            if (users.length === 0) {
                setIsLoading(true)
                const data = await fetchUsersData()
                const filteredData = data.filter((user: UserType) => user.role === "user" && !user.test)
                const mappedData = filteredData.map(user => ({
                    ...user,
                    createdAt: formatDate(user.createdAt),
                    lastLoggedIn: formatDate(user.lastLoggedIn)
                }))
                setUsers(mappedData)
                loadingTimer(setIsLoading)
            }
        }
        fetchData()
    }, [users])


    return (
        !isLoading
            ? <section className="flex flex-row bg-sky-100 min-h-screen">
                {role === "user" ?
                    <UserSidebar />
                    : <Sidebar />
                }
                <div className={`w-full transition-all duration-300 relative pb-20 lg:pb-0 ${isSidebarOpen ? "lg:ml-60" : "ml-0"}`}>
                    <Routes>
                        <Route path="/" element={
                            <ProtectedRoute>
                                <Landing />
                            </ProtectedRoute>

                        } />
                        <Route path="/countries" element={
                            <ProtectedRoute>
                                <Countries countries={countries} />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/new" element={
                            <ProtectedRoute>
                                <AddCountry />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/:country" element={
                            <ProtectedRoute>
                                <Country role={role} />
                            </ProtectedRoute>
                        } />
                        <Route path="/countries/:country/:card" element={
                            <ProtectedRoute>
                                <Card role={role}/>
                            </ProtectedRoute>
                        } />
                        <Route path="/users" element={
                            <ProtectedRoute>
                                <Users users={users} />
                            </ProtectedRoute>
                        } />
                        <Route path="/users/new" element={
                            <ProtectedRoute>
                                <AddUser countries={countries} users={users} />
                            </ProtectedRoute>
                        } />
                    </Routes>
                </div>
                {/* For mobile view
                {isSidebarOpen && width <= 640 && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 z-10" onClick={toggleSidebar}></div>
                )} */}
            </section>
            : null
    );
}

export default AdminPanel