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
        <div className="card-grid table-margins">
            {placesData.map((place, index) => (
                <div key={index} className="card-grid-body space-y-2">
                    {/* Title in the top right */}
                    <div className="flex flex-col text-start">
                        <label>
                            Name
                        </label>
                        <textarea
                            value={place.name}
                            rows={2}
                            onChange={(e) => onInputChange(e, index, "name")}
                            placeholder="City/Place name"
                        />
                    </div>

                    <div className="flex flex-col text-start ">
                        <label>
                            Description
                        </label>
                        <textarea
                            value={place.description}
                            rows={width > 640 ? 8 : 4}
                            onChange={(e) => onInputChange(e, index, "description")}
                            placeholder="Description"
                        />
                    </div>

                    <div className="flex mt-2 justify-end">
                        <button
                            type="button"
                            onClick={() => onDelete(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex items-end">
                <button className="add-btn hover-bg-gradient" onClick={onAdd}>
                    <i className="fa fa-plus"></i> Add a new place
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={onCancel} onSave={onSave} onBack={onBack}/>
        </div>
    )
}

export default Places;