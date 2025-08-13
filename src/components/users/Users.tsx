import React, { useState, useEffect } from "react"
import { UserType } from "../../types/types"
import { confirmModalWindow } from "../../global/Global"
import { changeUserStatus } from "../../service/UsersService"
import { useNavigate } from "react-router-dom"
import useWindowSize from "../../hooks/useScreenSize"
import Pagination from "../../global/Pagination"

interface UsersProps {
    users: UserType[]
}

const Users: React.FC<UsersProps> = ({ users }) => {
    const { width } = useWindowSize()
    const navigate = useNavigate()

    const [filteredUsers, setFilteredUsers] = useState<UserType[]>([])
    const [paginatedUsers, setPaginatedUsers] = useState<UserType[]>([])
    const [searchQuery, setSearchQuery] = useState('')
    const [rowsPerPage, setRowsPerPage] = useState(8)

    useEffect(() => {
        setFilteredUsers(users)
    }, [users])

    useEffect(() => {
        const search = users.filter(user =>
            user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
            user.country.toLowerCase().includes(searchQuery.toLowerCase())
        )
        setFilteredUsers(search)
    }, [searchQuery, users])


    useEffect(() => {
        setRowsPerPage(width > 640 ? 8 : 3)
    }, [width, rowsPerPage])


    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setSearchQuery(e.target.value);
    };

    const handleAddNewUser = () => navigate('/users/new');

    const toggleUserStatus = async (user: UserType) => {
        const isDisabled = user.disabled;
        const action = isDisabled ? "enable" : "disable";

        const confirmed = await confirmModalWindow(`Are you sure you want to ${action} this user?`);
        if (!confirmed) return;

        const success = await changeUserStatus(user.uid, !isDisabled);
        if (!success) return;

        setFilteredUsers(prev =>
            prev.map(u => u.uid === user.uid ? { ...u, disabled: !isDisabled } : u)
        );
    };

    return (
        <section className="bg-sky-100 min-h-screen text-[#1B75BB] py-8 px-4">
            <div className="max-w-6xl mx-auto space-y-8">
                {/* Main Header Section (always visible) */}
                <div className="bg-blue-50 p-4 sm:p-6 rounded-xl shadow-lg ">
                    <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
                        {/* Title */}
                        <div className="flex flex-row items-center gap-4 font-semibold text-2xl md:text-3xl lg:text-4xl text-[#1B75BB]">
                            <i className="fa-solid fa-users"></i>
                            <span className=" flex-shrink-0">
                                AP Users
                            </span>
                        </div>

                        {/* Right section: Search, Add New User */}
                        <div className="flex flex-row items-center gap-3 w-full sm:w-auto">
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
                                <i className="fa-solid fa-plus "></i>
                                <span className="hidden sm:block sm:ml-2">New user</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Users Table */}
                {filteredUsers.length > 0 ? (
                    <div>
                        <div className="w-full overflow-x-auto rounded-xl">
                            {/* Desktop version */}
                            <div className="hidden sm:block">
                                <table className="min-w-full bg-white rounded-xl shadow-md">
                                    <thead className="bg-[#1B75BB] text-center text-white text-sm uppercase font-semibold">
                                        <tr>
                                            <th className="py-3 px-4">Email</th>
                                            <th className="py-3 px-4">Country</th>
                                            <th className="py-3 px-4">Created</th>
                                            <th className="py-3 px-4">Last login</th>
                                            <th className="py-3 px-4">Status</th>
                                            <th className="py-3 px-4">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="table-row-group">
                                        {paginatedUsers.map((user, index) => (
                                            <tr key={index} className={`transition duration-200 ${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} hover:bg-blue-50`}>
                                                <td className="py-3 px-4 text-gray-700">{user.email}</td>
                                                <td className="py-3 px-4 text-gray-800 font-medium uppercase">{user.country}</td>
                                                <td className="py-3 px-4 text-gray-700">{user.createdAt}</td>
                                                <td className="py-3 px-4 text-gray-700">{user.lastLoggedIn}</td>
                                                <td className="py-3 px-4 text-gray-700">{!user.disabled ? 'Active' : 'Disabled'}</td>
                                                <td className="py-3 px-4 text-gray-700">
                                                    <button onClick={() => toggleUserStatus(user)} className={user.disabled ? 'text-green-500' : 'text-red-500'}>
                                                        <i className="fa-solid fa-power-off" />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile version */}
                            <div className="sm:hidden space-y-4 mt-4">
                                {paginatedUsers.map((user, index) => (
                                    <div key={index} className="bg-white rounded-xl shadow-md p-4 border border-gray-200">
                                        <div className="flex justify-between items-center mb-2">
                                            <h3 className="text-lg font-semibold text-blue-800">{user.email}</h3>
                                            <button
                                                onClick={() => toggleUserStatus(user)}
                                                className={`text-xl ${user.disabled ? 'text-green-500' : 'text-red-500'}`}
                                            >
                                                <i className="fa-solid fa-power-off" />
                                            </button>
                                        </div>
                                        <div className="text-gray-700 space-y-1 text-start">
                                            <p><span className="font-medium">Country:</span> {user.country}</p>
                                            <p><span className="font-medium">Created:</span> {user.createdAt}</p>
                                            <p><span className="font-medium">Last login:</span> {user.lastLoggedIn}</p>
                                            <p><span className="font-medium">Status:</span> {user.disabled ? 'Disabled' : 'Active'}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                        {/* Pagination Controls */}
                        <Pagination 
                            data={filteredUsers}
                            setPaginatedData={setPaginatedUsers}
                            rows={rowsPerPage}
                        />
                    </div>

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
                )
                }
            </div >
        </section >
    )
}

export default Users