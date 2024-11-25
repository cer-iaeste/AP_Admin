import React, { useState, useEffect } from "react";
import "../card/Card.css";
import CardFooter from "../card/CardFooter";
import { CardProps } from "../../global/Global";

interface CitiesProps extends CardProps {
    cities: string[]
}

const CitiesWithLcs: React.FC<CitiesProps> = ({ cities, country, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [committeesData, setCommitteesData] = useState<string[]>([])
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        setCommitteesData(structuredClone(cities))
    }, [cities]);

    const onAdd = () => handleAddNewItem(setCommitteesData, committeesData, "", setIsChanged)
    const onSave = () => handleSave(country, committeesData, "committees", "Cities with lcs", setIsChanged)
    const onCancel = () => handleCancel(setCommitteesData, committeesData, setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setCommitteesData, committeesData, setIsChanged)
    const onBack = () => handleBack(isChanged, setCommitteesData, committeesData, setIsChanged)
    const onInputChange = (e: any, index: number) => handleInputChange(setCommitteesData, committeesData, index, e.target.value, setIsChanged)

    return (
        <div className="elements-position space-y-5 mt-5 relative pb-24"> {/* Added padding for footer */}
            <table className="card-table">
                <thead>
                    <tr className="card-table-head">
                        <th>City name</th>
                        <th></th>
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
                                    onChange={(e) => onInputChange(e, index)}
                                    className="w-full py-2 px-1 border text-2xl bg-[#F1F1E6]"
                                />
                            </td>
                            <td className="p-2">
                                <button
                                    type="button"
                                    onClick={() => onDelete(index)}
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
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a new city
                </button>
            </div>


            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    );
};

export default CitiesWithLcs;
