import React, { useState, useEffect } from "react";
import "../card/Card.css";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService"

interface CitiesProps {
    cities: string[]
    country: string
}

const CitiesWithLcs: React.FC<CitiesProps> = ({ cities, country }) => {
    const [committeesData, setCommitteesData] = useState<string[]>([])
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        setCommitteesData(structuredClone(cities))
    }, [cities]);

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number) => {
        const newData = structuredClone(committeesData);
        newData[index] = e.target.value;
        setCommitteesData(newData);
        setIsChanged(true)
    };

    // Handle delete with confirmation
    const handleDeleteClick = (index: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(committeesData).filter((_: string, i: number) => i !== index)
            setCommitteesData(newData)
            setIsChanged(true)
        }
    }

    // Handle add new item
    const handleAddNewItem = () => {
        setCommitteesData([...committeesData, ""])
        setIsChanged(true)
    }

    // Handle save changes
    const handleSave = () => {
        updateCountryField(country, committeesData, "committees", "Cities with lcs").then(() => {
            setIsChanged(false)
        })
    };

    // Handle cancel changes
    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setCommitteesData(structuredClone(cities))
        setIsChanged(false); // Reset action in progress
    };
    return (
        <div className="elements-position space-y-5 mt-5 relative pb-24"> {/* Added padding for footer */}
            <table className="card-table">
                <thead>
                    <tr className="card-table-head">
                        <th>City Name</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {!!committeesData.length ? committeesData.map((city, index) => (
                        <tr key={index} className="card-table-row text-lg sm:text-xl">
                            <td className="w-full p-1">
                                <input
                                    type="text"
                                    placeholder="City name"
                                    value={city}
                                    onChange={(e) => handleInputChange(e, index)}
                                    className="w-full py-2 px-1 border text-2xl bg-[#F1F1E6]"
                                />
                            </td>
                            <td className="p-2">
                                <button
                                    type="button"
                                    onClick={() => handleDeleteClick(index)}
                                    className="btn delete-btn"
                                >
                                    <i className="fa fa-trash" aria-hidden="true"></i>
                                </button>
                            </td>
                        </tr>
                    )) : (
                        <tr>
                            <td colSpan={2} className="p-2">No committees available.</td>
                        </tr>
                    )}
                </tbody>
            </table>

            <div>
                <button className="flex items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2" onClick={handleAddNewItem}>
                    <i className="fa fa-plus"></i> Add a new city
                </button>
            </div>


            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    );
};

export default CitiesWithLcs;
