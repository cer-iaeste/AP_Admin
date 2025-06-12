import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import "../card/Card.css"
import { CityType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";
import { CardProps } from "../../global/Global";

interface PlacesProps extends CardProps {
    places: CityType[]
}

const Places: React.FC<PlacesProps> = ({ country, places, handleSave, handleDelete, handleCancel, handleBack, handleAddNewItem, handleInputChange }) => {
    const [placesData, setPlacesData] = useState<CityType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    useEffect(() => {
        setPlacesData(places)
    }, [places])

    const onAdd = () => handleAddNewItem(setPlacesData, placesData, { name: "", description: "" }, setIsChanged)
    const onSave = () => handleSave(country, placesData, "cities", "Recommended places", setIsChanged)
    const onDelete = (index: number) => handleDelete(index, setPlacesData, placesData, setIsChanged)
    const onCancel = () => handleCancel(isChanged, setPlacesData, places, setIsChanged)
    const onBack = () => handleBack(isChanged, setPlacesData, places, setIsChanged)
    const onInputChange = (e: any, index: number, column: string) => handleInputChange(setPlacesData, placesData, index, e.target.value, setIsChanged, column)

    return (
        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 mt-6 table-margins mx-2">
            {placesData.map((city, index) => (
                <div key={index} className="card-container">
                    <div className="card-footer-right">
                            <button
                                type="button"
                                onClick={() => onDelete(index)}
                                className="flex items-center py-1"
                                title="Remove place"
                            >
                                <i className="fa fa-trash" aria-hidden="true"></i>
                            </button>
                        </div>
                    <div className="card-subcontainer">
                        {/* Title in the top right */}
                        <div className="card-header card-header-sub">
                            Name
                        </div>
                        {/* Value input below buttons */}
                        <textarea
                            placeholder="Place name"
                            rows={2}
                            value={city.name}
                            onChange={(e) => onInputChange(e, index, "name")} // Update input value
                            className="text-input mt-1.5"
                            style={{ scrollbarWidth: 'thin'}}
                        />
                    </div>

                    <div className="card-subcontainer">
                        {/* Title in the top right */}
                        <div className="card-header card-header-sub">
                            Description
                        </div>
                        {/* Value input below buttons */}
                        <textarea
                            placeholder="Description"
                            rows={width > 640 ? 8 : 4}
                            value={city.description}
                            onChange={(e) => onInputChange(e, index, "description")} // Update input value
                            className="text-input mt-1.5"
                            style={{ scrollbarWidth: 'thin'}}
                        />
                    </div>
                </div>
            ))}

            <div className="flex items-end">
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a new place
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack} />
        </div>
    )
}

export default Places;