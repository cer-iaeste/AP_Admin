const Landing = () => {

    const cards = [
        {
            title: "Organized list of countries",
            desc: " Administrators can view, filter, and search the list of countries, making it easy to find and manage the desired country page",
            icon: "fa-clipboard-list"
        },
        {
            title: "Page management",
            desc: "Easily create, edit, or remove components that make up the structure and content of individual country pages",
            icon: "fa-file-signature"
        },
        {
            title: "Streamlined workflow",
            desc: "A user-friendly experience with options to quickly save and publish changes in real-time, ensuring smooth content updates across all country pages",
            icon: "fa-timeline"
        },
    ]

    return (
        <section className="bg-sky-100 h-full text-[#1B75BB] flex flex-col">
            <div className="my-4 text-center font-bold flex flex-col space-y-4 items-center">
                <i className="fa fa-cogs text-5xl"></i>
                <h1 className="text-5xl">IAESTE AP Admin Panel</h1>
            </div>
            <div className="max-w-2xl mx-auto text-center my-4 space-y-2">
                <h3 className="font-semibold text-3xl pb-2">Welcome, Admin!</h3>
                <span className="text-lg md:text-2xl">Manage the platform’s content and ensure each country's page is up-to-date. Use this dashboard to add, edit, or delete components for each country’s page and customize the information displayed to users.</span>
                <div className="pt-2 font-bold items-center text-lg">
                    <i className="fa fa-circle-info mr-3"></i>Start by selecting a country from the sidebar to access the country menu
                </div>
            </div>
            <div className="text-center sm:text-lg md:text-xl flex flex-col w-full mt-4">
                <div className="text-center items-center justify-center max-w-2xl mx-auto">
                    <h3 className="text-3xl font-semibold pb-2">About</h3>
                    <span>The Admin Panel is a powerful tool designed to help administrators manage the content for each country's page. It provides an intuitive interface for creating, updating, and deleting components associated with the pages of the countries listed on the platform.</span>
                </div>
                <div className="mt-8 space-y-4">
                    <span className="font-semibold text-3xl">Key features</span>
                    <ul className="grid grid-cols-1 lg:grid-cols-3 gap-8 px-4 max-w-5xl mx-auto">
                        {cards.map((card, index) =>
                            <li key={index} className="bg-gray-100 shadow-xl space-y-2 rounded-lg p-2 py-6 sm:p-6 text-center text-[#1B75BB] max-w-lg mx-auto">
                                {/* Top half with the icon */}
                                <div className="flex flex-col justify-center space-y-2 h-1/2">
                                    <i className={`fa ${card.icon} text-4xl aria-hidden='true'`} />
                                    <h1 className="text-2xl font-bold">{card.title}</h1>
                                </div>

                                {/* Bottom half with the title */}
                                <div className="flex grow items-center justify-center h-1/2">
                                    <h3 className="text-base">{card.desc}</h3>
                                </div>
                            </li>
                        )}
                    </ul>
                </div>
                
            </div>
        </section>
    )
}

export default Landing;