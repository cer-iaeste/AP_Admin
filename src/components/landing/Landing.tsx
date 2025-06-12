import React from "react";
import cerLogo from "../../images/cer-logo.png"

const Landing = () => {
    return (
        <section className="text-[#1B75BB] flex flex-col inset-0 relative">
            {/* <div className="my-4 text-center font-bold flex flex-col space-y-4 items-center">
                <i className="fa fa-cogs text-5xl"></i>
                <h1 className="text-5xl">IAESTE AP Admin Panel</h1>
            </div> */}
            <div>
                    <div className="max-w-4xl mx-auto text-center my-4 space-y-2">
                        <img alt="CER Summer App" className="h-32 w-auto mx-auto" src={cerLogo} />
                        <h3 className="font-semibold text-3xl lg:text-4xl py-2">Welcome, Admin!</h3>
                        <span className="text-lg md:text-2xl">Manage the platform’s content and ensure each country's page is up-to-date. Use this dashboard to add, edit or delete components for each country and customize the information displayed to users.</span>
                    </div>
                    <div className="font-bold items-center text-lg">
                        <i className="fa fa-circle-info mr-3"></i>Start by selecting a section from the sidebar
                    </div>
                </div>
        </section>
    )
}

export default Landing;