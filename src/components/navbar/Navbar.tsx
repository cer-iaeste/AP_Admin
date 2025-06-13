import React from "react";

interface NavbarProps {
  toggleSidebar: () => void
  back: () => void
  pathname: string
  isSidebarOpen: boolean
  width: number
}

const Navbar: React.FC<NavbarProps> = ({ toggleSidebar, back, pathname, isSidebarOpen, width }) => (
  <div className={`z-100 absolute top-0 transition-all duration-300 ${!isSidebarOpen && width <= 1024 ? 'left-0' : 'hidden'} flex flex-row`}>
    <button
      className="icon cursor-pointer rounded-sm px-2.5 py-1 text-[#1B75BB] hover-bg-gradient justify-start w-10"
      onClick={toggleSidebar}>
      <i className="fa fa-bars text-base sm:text-xl"></i>
    </button>
    <button
      className={`icon ${pathname !== "/" ? "block" : "hidden"} cursor-pointer rounded-sm px-2.5 py-1 text-[#1B75BB] hover-bg-gradient justify-start w-10`}
      onClick={back}>
      <i className="fa-chevron-left fa-solid text-base sm:text-xl"></i>
    </button>
  </div>
)

export default Navbar;
