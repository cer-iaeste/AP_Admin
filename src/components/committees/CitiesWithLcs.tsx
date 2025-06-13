import React, { useState, useEffect } from "react";
import "../card/Card.css";
import CardFooter from "../card/CardFooter";
import { CardProps } from "../../global/Global";

interface CitiesProps extends CardProps {
    cities: string[]
}

const CitiesWithLcs: React.FC<CitiesProps> = ({ cities, country, handleSave, handleDelete, handleCancel, handleAddNewItem, handleInputChange }) => {
    const [committeesData, setCommitteesData] = useState<string[]>([])
    const [isChanged, setIsChanged] = useState(false)

    useEffect(() => {
        setCommitteesData(structuredClone(cities))
    }, [cities]);

    const onAdd = () => handleAddNewItem(setCommitteesData, committeesData, "", setIsChanged)
    const onSave = () => handleSave(country, committeesData, "committees", "Cities with lcs", setIsChanged)
    const onCancel = () => handleCancel(isChanged, setCommitteesData, committeesData, setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setCommitteesData, committeesData, setIsChanged)
    const onInputChange = (e: any, index: number) => handleInputChange(setCommitteesData, committeesData, index, e.target.value, setIsChanged)

    return (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 table-margins mx-2"> {/* Added padding for footer */}
            {committeesData.map((city, index) => (
                <div key={index} className="card-container">
                    {/* Title in the top right */}
                    <div className="card-header">
                        City #{index + 1}
                    </div>
                    <div className="card-header-right">
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="flex items-center py-1"
                            title="Remove city"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>

                    {/* Value input below buttons */}
                    <input
                        value={city}
                        onChange={(e) => onInputChange(e, index)} // Update input value
                        className="text-input"
                    />
                </div>
            ))}

            <div>
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a new city
                </button>
            </div>


            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} />
        </div>
    );
};

export default CitiesWithLcs;
