import React from "react";
import Path from "../path/Path";
import AuthService from "../../service/AuthService";

interface AdminNavbarProps {
  toggleSidebar: () => void
  navigateHome: () => void
  navigateCountry: () => void
  role: "admin" | "user"
  country?: string
  card?: string
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar, navigateHome, navigateCountry, role, country, card }) => {

  const handleLogout = async () => {
    try {
      await AuthService.logout();
      window.location.href = "/login"
    } catch (error: any) {
      alert("Error loggin out!")
    }
  }

  return (
    <div className="mx-auto">
      <header className="w-full bg-[#F1F1E6]">
        <div className="relative p-1">
          <nav
            className="relative flex items-center justify-between sm:h-10 xl:justify-start"
            aria-label="Global"
          >
            <div className="flex flex-grow">
              <div className="grid grid-cols-3 sm:grid-cols-5 w-full items-center">
                <button
                  className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 justify-start w-20"
                  onClick={toggleSidebar}>
                  <i className="fa fa-bars text-base sm:text-xl"></i>
                </button>
                <div className="grid grid-cols-subgrid col-span-1 sm:col-span-3">
                  <div className="sm:col-start-2 justify-center">
                    {(role==="admin" && !country) || (role==="user" && !card) ?
                      <h1 className="text-xl text-[#1B75BB] ">AP Admin Panel</h1>
                      : <Path navigateHome={navigateHome} navigateCountry={navigateCountry} country={country} card={card} role={role}/>
                    }
                  </div>

                </div>
                <div className="flex w-full justify-end">
                  <button
                    className="flex flex-row items-center cursor-pointer rounded-md border border-[#1B75BB] ml-4 px-2.5 py-1 text-[#1B75BB] hover:text-white hover:bg-[#1B75BB]"
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
