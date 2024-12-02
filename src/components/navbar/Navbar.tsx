import React from "react";
import AuthService from "../../service/AuthService";
import { toast } from 'react-toastify';

interface AdminNavbarProps {
  toggleSidebar: () => void
  role: "admin" | "user"
  country?: string
  card?: string
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar, role, country, card }) => {

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = "/login"
      toast.success("Logout successfull!")
    } catch (error: any) {
      toast.error("Error loggin out!")
    }
  }

  return (
    <div className="mx-auto h-10">
      <header className="w-full h-full pt-1.5 sm:pt-0.5 bg-[#F1F1E6] border-b border-[#1B75BB]">
        <div className="relative px-2">
          <nav
            className="relative flex items-center justify-between xl:justify-start"
            aria-label="Global"
          >
            <div className="flex flex-grow">
              <div className="grid grid-cols-3 sm:grid-cols-5 w-full items-center">
                <button
                  className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover-bg-gradient justify-start w-10"
                  onClick={toggleSidebar}>
                  <i className="fa fa-bars text-base sm:text-xl"></i>
                </button>
                <div className="grid grid-cols-subgrid col-span-1 sm:col-span-3">
                  <div className="sm:col-start-2 justify-center">
                    {role === "admin" ?
                      <a href="/" className="text-xl text-[#1B75BB] flex justify-center items-center gap-2 rounded-md p-1 hover-bg-gradient ">
                        <i className="fa fa-house"/>
                        <span className="hidden sm:block">Admin Panel</span>
                      </a>
                      : <h1 className="text-xl text-[#1B75BB] ">Admin Panel</h1>
                    }
                  </div>

                </div>
                <div className="flex w-full justify-end">
                  <button
                    className="flex flex-row items-center cursor-pointer rounded-md border border-[#1B75BB] ml-4 px-2.5 py-1 text-[#1B75BB] hover-bg-gradient"
                    onClick={handleLogout}>
                    <i className="fa-solid fa-person-hiking mr-1"></i>
                    <span className="hidden sm:block">Log out</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default AdminNavbar;
