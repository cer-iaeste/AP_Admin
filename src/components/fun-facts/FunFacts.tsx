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
                            onClick={() => onDelete(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>

                    {/* Value input below buttons */}
                    <textarea
                        value={fact}
                        rows={width > 640 ? 8 : 4}
                        onChange={(e) => onInputChange(e, index)} // Update input value
                        className="w-full border-2 p-2 text-xl"
                    />
                </div>
            ))}

            <div className="flex items-end">
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a fun fact
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default FunFacts