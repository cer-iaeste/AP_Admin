import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import useWindowSize from "../../hooks/useScreenSize";
import "../card/Card.css"

interface FunFactsProps {
    country: string
    facts: string[]
}

const FunFacts: React.FC<FunFactsProps> = ({ country, facts }) => {
    const [factsData, setFactsData] = useState<string[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    useEffect(() => {
        setFactsData(facts)
    }, [facts])

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number) => {
        const newData = structuredClone(facts)
        newData[index] = e.target.value
        setFactsData(newData)
        setIsChanged(true)
    };

    // Handle add new item
    const handleAddNewItem = () => {
        setFactsData([...factsData, ""])
        setIsChanged(true)
    }

    // Handle delete with confirmation
    const handleDeleteClick = (index: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(factsData).filter((_: string, i: number) => i !== index)
            setFactsData(newData)
            setIsChanged(true)
        }
    }

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setFactsData(structuredClone(facts))
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        updateCountryField(country, factsData, "facts", "Fun facts").then(() => {
            setIsChanged(false)
        })
    };

    return (
        <div className="card-grid table-margins">
            {factsData.map((fact, index) => (
                <div key={index} className="card-grid-body">
                    {/* Title in the top right */}
                    <div className="card-grid-header">
                        <span className="card-grid-title">
                            Fun fact #{index + 1}
                        </span>
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>

                    {/* Value input below buttons */}
                    <textarea
                        value={fact}
                        rows={width > 640 ? 8 : 4}
                        onChange={(e) => handleInputChange(e, index)} // Update input value
                        className="w-full border-2 p-2 text-xl"
                    />
                </div>
            ))}

            <div className="flex items-end">
                <button className="flex text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center" onClick={handleAddNewItem}>
                    <i className="fa fa-plus"></i> Add a fun fact
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default FunFacts