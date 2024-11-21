import React, { useState, useEffect } from "react";
import CardFooter from "../card/CardFooter";
import { updateCountryField } from "../../service/CountryService";
import "../card/Card.css"
import { CityType } from "../../types/types";
import useWindowSize from "../../hooks/useScreenSize";

interface PlacesProps {
    country: string
    places: CityType[]
}

const Places: React.FC<PlacesProps> = ({ country, places }) => {
    const [placesData, setPlacesData] = useState<CityType[]>([])
    const [isChanged, setIsChanged] = useState(false)

    const { width } = useWindowSize()

    useEffect(() => {
        setPlacesData(places)
    }, [places])

    // Handle the change in input during editing
    const handleInputChange = (e: any, index: number, column: keyof CityType) => {
        const newData = structuredClone(placesData)
        newData[index][column] = e.target.value
        setPlacesData(newData)
        setIsChanged(true)
    };

    // Handle add new item
    const handleAddNewItem = () => {
        setPlacesData([...placesData, { name: "", description: "" }])
        setIsChanged(true)
    }

    // Handle delete with confirmation
    const handleDeleteClick = (index: number) => {
        const confirmDelete = window.confirm("Are you sure you want to delete this item?");
        if (confirmDelete) {
            const newData = structuredClone(placesData).filter((_: CityType, i: number) => i !== index)
            setPlacesData(newData)
            setIsChanged(true)
        }
    }

    // Cancel the current action (reset the editing state)
    const handleCancel = () => {
        setPlacesData(structuredClone(places))
        setIsChanged(false) // Reset action in progress
    };

    // Save changes (apply the changes and close edit mode)
    const handleSave = () => {
        updateCountryField(country, placesData, "cities", "Recommended places").then(() => {
            setIsChanged(false)
        })
    };

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
                            onChange={(e) => handleInputChange(e, index, "name")}
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
                            onChange={(e) => handleInputChange(e, index, "description")}
                            placeholder="Description"
                        />
                    </div>

                    <div className="flex mt-2 justify-end">
                        <button
                            type="button"
                            onClick={() => handleDeleteClick(index)}
                            className="btn delete-btn"
                        >
                            <i className="fa fa-trash" aria-hidden="true"></i>
                        </button>
                    </div>
                </div>
            ))}

            <div className="flex items-end">
                <button className="flex text-xl items-center p-2 rounded-md bg-[#1B75BB] hover-bg-gradient text-white gap-2 justify-center" onClick={handleAddNewItem}>
                    <i className="fa fa-plus"></i> Add a new place
                </button>
            </div>

            {/* Reusable CardFooter Component */}
            <CardFooter isChanged={isChanged} onCancel={handleCancel} onSave={handleSave} />
        </div>
    )
}

export default Places;