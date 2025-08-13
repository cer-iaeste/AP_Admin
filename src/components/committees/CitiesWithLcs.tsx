import React, { useState, useEffect, useContext } from "react";
import "../card/Card.css";
import { toast } from 'react-toastify';
import FormButtons from "../card/FormButtons";
import CardContext from "../card/CardContext";

interface CitiesProps {
    cities: string[];
}

const CitiesWithLcs: React.FC<CitiesProps> = ({ cities }) => {
    const context = useContext(CardContext);
    const [committeesData, setCommitteesData] = useState<string[]>([]);
    const [isAddingCity, setIsAddingCity] = useState(false);
    const [isDeleteMode, setIsDeleteMode] = useState(false);
    const [newCityName, setNewCityName] = useState("");
    const [cityFilter, setCityFilter] = useState("");

    useEffect(() => {
        setCommitteesData(structuredClone(cities));
        setIsChanged(false);
    }, [cities]);

    useEffect(() => {
        setIsChanged(JSON.stringify(committeesData) !== JSON.stringify(cities));
    }, [committeesData, cities]);

    if (!context) {
        console.error("Component must be used within a CardContext.Provider");
        return null;
    }

    const { countryName, handleSave, handleCancel, handleAddNewItem, handleDelete, isChanged, setIsChanged, isLoading } = context;

    const onAddNewCity = () => {
        if (committeesData.some(city => city.toLowerCase() === newCityName.trim().toLowerCase())) {
            toast.error("This city already exists.");
            setNewCityName("");
            return;
        }
        handleAddNewItem(setCommitteesData, committeesData, newCityName.trim());
        setNewCityName("");
    };

    const onSave = () => handleSave(countryName, committeesData, "committees", "Cities with LCs");
    const onCancel = () => handleCancel(setCommitteesData, cities);
    const onDelete = (index: number) => handleDelete(index, setCommitteesData, committeesData);

    const filteredCities = committeesData.filter(city =>
        city.toLowerCase().includes(cityFilter.toLowerCase())
    );

    return (
        <div className=" flex flex-col space-y-4 mt-8">
            <div className="flex flex-row justify-between w-full gap-4">
                {/* Search Bar */}
                <input
                    type="text"
                    placeholder="Search cities..."
                    value={cityFilter}
                    onChange={(e) => setCityFilter(e.target.value)}
                    className="text-input px-4 py-2 border border-blue-300 rounded-lg text-lg shadow-sm w-full sm:hidden"
                    disabled={isAddingCity || isDeleteMode}
                />
                <button
                    type="button"
                    onClick={() => setIsAddingCity(true)}
                    className={`w-full sm:w-auto px-5 md:px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg font-semibold w-4 md:min-w-20 
                        ${!isAddingCity && !cityFilter && !isDeleteMode ? "text-white bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-blue-400"
                            : "bg-stone-100 text-stone-300"}`}
                    disabled={isAddingCity && cityFilter && isDeleteMode ? true : false}
                >
                    <i className="fa fa-plus text-sm md:text-lg"></i>
                    <span className="hidden md:block">
                        Add
                    </span>
                </button>
                <button
                    type="button"
                    onClick={() => setIsDeleteMode(prev => !prev)}
                    className={`w-full sm:w-auto px-5 md:px-8 py-3 rounded-xl shadow-lg flex items-center justify-center gap-2 text-lg font-semibold w-4 md:min-w-20 
                        ${filteredCities.length && !isAddingCity ? "text-white bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 transition-all duration-300 ease-in-out transform hover:scale-105 focus:outline-none focus:ring-3 focus:ring-blue-400"
                            : "bg-stone-100 text-stone-300"}`}
                    disabled={isAddingCity && !filteredCities.length ? true : false}
                >
                    <i className={`fa ${isDeleteMode ? "fa-check" : "fa-trash"}  text-sm md:text-lg`}></i>
                    <span className="hidden md:block">
                        {isDeleteMode ? "Done" : "Remove"}
                    </span>
                </button>
            </div>


            {/* Scrollable Tags Container */}
            <div className="px-1 scroll-smooth bg-blue-50 border border-blue-200 rounded-lg shadow-inner py-4 min-h-[100px]
                            max-h-[320px] overflow-y-auto sm:max-h-none sm:overflow-y-visible
                            flex flex-wrap gap-2 justify-start items-start">
                {filteredCities.length > 0 ? (
                    filteredCities.map((city, index) => (
                        <span key={index} className="mt-2 flex-shrink-0 inline-flex items-center bg-gradient-to-br from-blue-200 to-blue-300 text-blue-900 text-xl font-semibold px-5 py-2.5 rounded-full shadow-md border border-blue-400 mx-2 my-1 transition-all duration-300 ease-in-out hover:from-blue-300 hover:to-blue-400 hover:scale-105 hover:shadow-lg hover:border-blue-500 cursor-pointer">
                            {city}
                            {isDeleteMode && (
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
                                    className="ml-3 text-blue-700 hover:text-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 rounded-full -mr-1.5 transition-colors duration-200"
                                    title={`Remove ${city}`}
                                >
                                    <i className="fa fa-times text-sm"></i>
                                </button>
                            )}
                        </span>
                    ))
                ) : (
                    <p className="text-gray-500 text-center w-full py-6 text-lg">No cities match your filter.</p>
                )}
                {isAddingCity && (
                    <span key="new" className="inline-flex items-center bg-blue-100 text-blue-800 text-xl font-semibold px-5 py-2.5 rounded-full shadow-sm border border-blue-400 mx-2 my-1 gap-2">
                        <input
                            type="text"
                            value={newCityName}
                            autoFocus
                            onChange={(e) => setNewCityName(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                    onAddNewCity();
                                    setIsAddingCity(false);
                                } else if (e.key === 'Escape') {
                                    setNewCityName('');
                                    setIsAddingCity(false);
                                }
                            }}
                            className="bg-transparent border-none focus:outline-none text-blue-900 font-semibold text-base w-32"
                            placeholder="New city..."
                        />
                        <button
                            onClick={() => {
                                onAddNewCity();
                                setIsAddingCity(false);
                            }}
                            className={`${newCityName ? "text-green-600 hover:text-green-800" : "text-stone-300"}`}
                            title="Confirm"
                            disabled={!newCityName}
                        >
                            <i className="fa fa-check" />
                        </button>
                        <button
                            onClick={() => {
                                setNewCityName('');
                                setIsAddingCity(false);
                            }}
                            className="text-red-600 hover:text-red-800"
                            title="Cancel"
                        >
                            <i className="fa fa-times" />
                        </button>
                    </span>
                )}
            </div>

            {/* Save/Cancel Buttons */}
            <FormButtons isChanged={isChanged} onSave={onSave} isLoading={isLoading} onCancel={onCancel} />
        </div>
    );
};

export default CitiesWithLcs;