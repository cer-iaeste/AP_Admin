import React, { useState, useEffect } from "react"
import { UserType } from "../../types/types"

interface UsersProps {
    users: UserType[]
}

const Users: React.FC<UsersProps> = ({ users }) => {
    const [displayedUsers, setDisplayedUsers] = useState<UserType[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    
    useEffect(() => {
        setDisplayedUsers(users.filter(user => user.role === "user" && !user.test))
    }, [users])


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleAddNewUser = () => {

    }

    return (
        <section className="bg-sky-100 min-h-screen text-[#1B75BB] py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Main Header Section (always visible) */}
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg border border-gray-200">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Title */}
                        <div className="flex flex-row items-center gap-4 font-semibold text-2xl md:text-3xl lg:text-4xl text-gray-800">
                            <i className="fa-solid fa-users"></i>
                            <span className=" flex-shrink-0">
                                AP Users
                            </span>
                        </div>

                        {/* Right section: Search, Add New User */}
                        <div className="flex flex-col sm:flex-row items-center gap-3 w-full sm:w-auto">
                            {/* Search Input */}
                            <input
                                value={searchQuery}
                                type="text"
                                className="p-2 w-full sm:max-w-40 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-800 shadow-sm text-base"
                                placeholder="Search for a user..."
                                onChange={handleSearchChange}
                            />
                            {/* Add New User Button */}
                            <button
                                className="base-btn bg-[#1B75BB] text-white hover:bg-[#155A90]"
                                onClick={handleAddNewUser}
                            >
                                <i className="fa-solid fa-plus mr-1 md:mr-2"></i>
                                <span>New user</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Countries List */}
                {displayedUsers.length > 0 ? (
                    <table className="min-w-full bg-white border border-[#1B75BB] rounded-xl shadow-md overflow-hidden">
                        <thead className="bg-[#1B75BB] text-center text-white text-sm uppercase font-semibold">
                            <tr>
                                <th className="py-3 px-4">Email</th>
                                <th className="py-3 px-4">Country</th>
                                <th className="py-3 px-4">Status</th>
                                <th className="py-3 px-4">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {displayedUsers.map((user, index) => (
                                <tr
                                    key={index}
                                    data-name={user.country}
                                    /* onClick={handleSelectCountry} */
                                    className={`hover:bg-blue-50 cursor-pointer transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'}`}
                                >
                                    <td className="py-3 px-4 text-gray-700">{user.email}</td>
                                    <td className="py-3 px-4 text-gray-800 font-medium uppercase">{user.country}</td>
                                    <td className="py-3 px-4 text-gray-700">{!user.disabled ? 'Active' : 'Disabled'}</td>
                                    <td className="py-3 px-4 text-gray-700">
                                        <i className="fa-solid fa-x" />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                ) : (
                    <div className="flex w-full justify-center mt-16 mb-6">
                        <div
                            className="bg-red-50 border border-red-200 text-red-700 px-8 py-6 rounded-xl shadow-md flex items-center space-x-3 text-lg sm:text-xl"
                            role="alert" aria-live="polite"
                        >
                            <i className="fa-solid fa-triangle-exclamation mr-2 text-2xl"></i>{" "}
                            <span>No users found for your current filters!</span>
                        </div>
                    </div>
                )}
            </div>
        </section>
    )
}

export default Users