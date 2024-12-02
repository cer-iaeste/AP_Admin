import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import useWindowSize from "../../hooks/useScreenSize";
import "../card/Card.css"
import { CardProps } from "../../global/Global";

interface FunFactsProps extends CardProps {
    facts: string[]
}

const FunFacts: React.FC<FunFactsProps> = ({ country, facts, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [factsData, setFactsData] = useState<string[]>([])
    const [isChanged, setIsChanged] = useState(false)
    const { width } = useWindowSize()

    useEffect(() => {
        setFactsData(facts)
    }, [facts])

    const onAdd = () => handleAddNewItem(setFactsData, factsData, "", setIsChanged)
    const onSave = () => handleSave(country, factsData, "facts", "Fun facts", setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setFactsData, factsData, setIsChanged)
    const onCancel = () => handleCancel(isChanged, setFactsData, facts, setIsChanged)
    const onBack = () => handleBack(isChanged, setFactsData, facts, setIsChanged)
    const onInputChange = (e: any, index: number) => handleInputChange(setFactsData, factsData, index, e.target.value, setIsChanged)

    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 mt-6 table-margins mx-2">
            {factsData.map((fact, index) => (
                <div key={index} className="card-container">
                    {/* Title in the top right */}
                    <div className="card-header">
                        Fun fact #{index + 1}
                    </div>
                    <div className="card-header-right">
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="font-semibold"
                        >
                            Remove
                            <i className="fa fa-trash ml-1" aria-hidden="true"></i>
                        </button>
                    </div>

                    {/* Value input below buttons */}
                    <textarea
                        value={fact}
                        rows={4}
                        onChange={(e) => onInputChange(e, index)} // Update input value
                        className="w-full border-2 p-2"
                    />
                </div>
            ))}

            <div className="flex items-end">
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a fun fact
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default FunFacts