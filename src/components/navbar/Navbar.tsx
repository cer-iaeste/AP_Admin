import React from "react";
import Path from "../path/Path";

interface AdminNavbarProps {
    toggleSidebar: () => void
    navigateHome: () => void
    navigateCountry: () => void
    country?: string
    card?: string
  }

const AdminNavbar: React.FC<AdminNavbarProps> = ({ toggleSidebar, navigateHome, navigateCountry, country, card }) => {

  return (
    <div className="mx-auto">
      <header className="w-full bg-sky-100">
        <div className="relative p-1">
          <nav
            className="relative flex items-center justify-between sm:h-10 xl:justify-start"
            aria-label="Global"
          >
            <div className="flex flex-grow items-center">
              <div className="flex w-full items-center justify-between px-4">
                <button
                  className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 block lg:hidden"
                  onClick={toggleSidebar}>
                  <i className="fa fa-bars text-base sm:text-xl "></i>
                </button>
                <Path navigateHome={navigateHome} navigateCountry={navigateCountry} country={country} card={card} />
              </div>
            </div>
          </nav>
        </div>
      </header>
    </div>
  )
}

export default AdminNavbar;
