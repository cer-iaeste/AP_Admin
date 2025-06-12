import React, { useEffect, useState } from "react";
import cerLogo from "../../images/cer-logo.png";
import "../../App.css"
import { useNavigate, useParams } from "react-router-dom";
import { SIDEBAR_SECTIONS } from "../../global/Global";
import AuthService from "../../service/AuthService";
import { toast } from 'react-toastify';
import useWindowSize from "../../hooks/useScreenSize"

interface SidebarProps {
    isOpen: boolean,
    toggleSidebar: () => void
}

const Sidebar: React.FC<SidebarProps> = ({ isOpen, toggleSidebar }) => {
    const [selectedSection, setSelectedSection] = useState<Number>(-1);
    const navigate = useNavigate();
    const params = useParams()
    const { width } = useWindowSize()

    const handleSelectSection = (link: string, index: Number): void => {
        console.log(width)
        setSelectedSection(index)
        if (width <= 1024) toggleSidebar()
        navigate(link)
    }

    const resetSidebar = (): void => {
        setSelectedSection(-1)
        navigate('')
        //toggleSidebar()
    }

    useEffect(() => {
        const section = params['*']
        setSelectedSection(SIDEBAR_SECTIONS.findIndex(ss => ss.name === section))
    }, [params])

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
        <section className={`fixed z-20 top-0 left-0 bg-[#F1F1E6] border-r border-[#1B75BB] w-48 max-h-screen min-h-full transform transition-transform duration-300 ${isOpen ? "translate-x-0" : "-translate-x-full"}`}
            style={{ scrollbarWidth: "thin" }}
        >
            <ul>
                <li key="admin" className="border-b-2 px-2 text-2xl font-semibold  cursor-pointer flex justify-between">
                    <button onClick={resetSidebar} className="items-center hover:scale-105">
                        <img alt="CER Summer App" className="h-16 w-auto" src={cerLogo} />
                    </button>
                    {/*
                    <button
                        className="icon cursor-pointer rounded-full px-2.5 py-1 text-[#1B75BB] hover:text-sky-300 block lg:hidden"
                        onClick={toggleSidebar}
                        >
                        <i className="fa-regular fa-circle-xmark text-3xl "></i>
                    </button>*/}
                </li>
                {SIDEBAR_SECTIONS.map((section, index) => 
                    <li key={index} onClick={() => handleSelectSection(section.link, index)} className={`flex flex-row items-center px-6 py-3 border-b border-gray-300 hover-bg-gradient cursor-pointer ${selectedSection === index ? `bg-gradient text-white` : "text-[#1B75BB]"}`}>
                        <i className={section.icon} />
                        <span className="text-lg ml-3 font-semibold text-wrap">{section.name}</span>
                    </li>
                )}
            </ul>
            {/* Log Out Button */}
            <div className="absolute bottom-0 w-full">
                <button 
                    onClick={handleLogout} 
                    className="flex flex-row items-center px-6 py-3 w-full text-left text-[#1B75BB] border-t border-gray-300 hover-bg-gradient cursor-pointer"
                >
                    <i className="fa-solid fa-right-from-bracket" /> {/* Example log out icon */}
                    <span className="text-lg ml-3 font-semibold">Log Out</span>
                </button>
            </div>
        </section>
    )
}

export default Sidebar;