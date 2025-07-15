import React, { useState, useEffect } from "react";
import { UserType } from "../../types/types";
import { confirmModalWindow, formatDate } from "../../global/Global";
import { changeUserStatus } from "../../service/UsersService"
import { useNavigate } from "react-router-dom";

interface UsersTabProps {
    countryName: string
    users: UserType[]
    setUsers: React.Dispatch<React.SetStateAction<UserType[]>>;
    role: "admin" | "user"
}

const UsersTab: React.FC<UsersTabProps> = ({ countryName, users, setUsers, role }) => {
    const [countryUsers, setCountryUsers] = useState<UserType[]>([])
    const [activeUsers, setActiveUsers] = useState<number>(0)
    const navigate = useNavigate()

    useEffect(() => {
        setCountryUsers(users.map(user => ({
            ...user,
            createdAt: formatDate(user.createdAt),
            lastLoggedIn: formatDate(user.lastLoggedIn)
        })))
        setActiveUsers(users.filter(user => !user.disabled).length)
    }, [users])

    const toggleUserStatus = async (user: UserType) => {
        const isDisabled = user.disabled;
        const action = isDisabled ? "enable" : "disable";

        const confirmed = await confirmModalWindow(`Are you sure you want to ${action} this user?`);
        if (!confirmed) return;

        const success = await changeUserStatus(user.uid, !isDisabled);
        if (!success) return;

        setUsers((prev: UserType[]) =>
            prev.map(u => u.uid === user.uid ? { ...u, disabled: !isDisabled } : u)
        );
    };

    const handleAddNewUser = () => navigate(`/users/new?country=${encodeURIComponent(countryName)}`);

    return (
        <section>
            {countryUsers.length > 0 ? (
                <div>
                    <div className="w-full overflow-x-auto">
                        <table className="min-w-full bg-white border border-[#1B75BB] rounded-xl shadow-md overflow-hidden">
                            <thead className="bg-[#1B75BB] text-center text-white text-sm uppercase font-semibold">
                                <tr>
                                    <th className="py-3 px-4">Email</th>
                                    <th className="py-3 px-4">Country</th>
                                    <th className="py-3 px-4">Created</th>
                                    <th className="py-3 px-4">Last login</th>
                                    <th className="py-3 px-4">Status</th>
                                    <th className={`py-3 px-4 ${role === "admin" ? "block" : "hidden"}`}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {countryUsers.map((user, index) => (
                                    <tr
                                        key={index}
                                        data-name={user.country}
                                        /* onClick={handleSelectCountry} */
                                        className={`hover:bg-blue-50 cursor-pointer transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                    >
                                        <td className="py-3 px-4 text-gray-700">{user.email}</td>
                                        <td className="py-3 px-4 text-gray-800 font-medium uppercase">{user.country}</td>
                                        <td className="py-3 px-4 text-gray-700">{user.createdAt}</td>
                                        <td className="py-3 px-4 text-gray-700">{user.lastLoggedIn}</td>
                                        <td className="py-3 px-4 text-gray-700">{!user.disabled ? 'Active' : 'Disabled'}</td>
                                        <td className={`py-3 px-4 ${role === "admin" ? "block" : "hidden"} text-gray-700`}>
                                            <button onClick={() => toggleUserStatus(user)} className={user.disabled ? 'text-green-500' : 'text-red-500'}>
                                                <i className="fa-solid fa-power-off" />
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="flex w-full justify-center mt-16">
                    <div
                        className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-md flex items-center space-x-3 text-lg sm:text-xl"
                        role="alert" aria-live="polite"
                    >
                        <i className="fa-solid fa-triangle-exclamation mr-2 text-2xl"></i>{" "}
                        <span>No users registered for this country yet!</span>
                    </div>
                </div>
            )}
            {activeUsers < 3 && (
                <div className="flex items-center justify-end w-full mt-8">
                    <button
                        className="base-btn bg-[#1B75BB] text-white hover:bg-[#155A90]"
                        onClick={handleAddNewUser}
                    >
                        <i className="fa-solid fa-plus "></i>
                        <span className="hidden sm:block sm:ml-2">New user</span>
                    </button>
                </div>
            )}
        </section>

    )
}

export default UsersTab