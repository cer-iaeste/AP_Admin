import React from "react";
import cerLogo from "../../images/cer-logo.png"

const Landing: React.FC = () => {
    return (
        <section className="bg-sky-100 text-[#1B75BB] flex flex-col items-center py-8 min-h-screen p-4">
            {/* Main content card: Logo, Welcome, and Description */}
            <div className="
                max-w-4xl mx-auto w-full // Max width and centering
                bg-white p-8 rounded-xl shadow-lg border border-gray-200 // Modern card styling
                text-center space-y-4 // Center content and vertical spacing
            ">
                <img alt="CER Summer App" className="h-32 w-auto mx-auto" src={cerLogo} />
                <h3 className="font-semibold text-3xl lg:text-4xl py-2 text-gray-800">
                    Welcome, Admin!
                </h3>
                <span className="text-lg md:text-xl text-gray-700 leading-relaxed">
                    Manage the platform’s content and ensure each country's page is up-to-date.
                    Use this dashboard to add, edit or delete components for each country and customize the information displayed to users.
                </span>
                <div className="font-bold text-xl mt-8 text-gray-700 flex items-center justify-center">
                    <i className="fa fa-circle-info mr-3"></i>
                    <span>Start by selecting a section from the sidebar</span>
                </div>
            </div>
        </section>
    );
}

export default Landing;
